import {setupApp} from "../../../src/setup-app";
import {MongoClient} from "mongodb";
import {runDb} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";
import request from "supertest";
import {BlogInputDto} from "../../../src/blogs/dto/blog-input.dto";
import {PostInputDto} from "../../../src/posts/dto/post-input.dto";

describe ("blogs tests", () => {

    const app = setupApp();
    let client: MongoClient;

    const correctBlogDto: BlogInputDto[] = [];

    for (let i = 0; i < 10; i++) {
        correctBlogDto[i] = {
            name: `Blog ${i}`,
            description: `Blog ${i} description`,
            websiteUrl: `https://blog${i}.com`,
        }

    }

    const correctPostDto: PostInputDto[] = [];

    for (let i = 0; i < 10; i++) {
        correctPostDto[i] = {
            title: `Post ${i}`,
            shortDescription: `Post ${i} description`,
            content: `Post ${i} content`,
            blogId: "1",
        }

    }

    beforeAll(async () => {
        client = await runDb(SETTINGS.MONGO_URL)
    })

    beforeEach(async () => {
        await request(app)
            .delete("/testing/all-data")
            .expect(204)
    })

    afterAll(async () => {
        await client.close();
    })


    it ("POST Should create and return new blog; 201 created", async () => {
        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)


        expect(newBlog.body).toEqual({
            id: expect.any(String),
            name: `Blog 0`,
            description: `Blog 0 description`,
            websiteUrl: `https://blog0.com`,
            createdAt: expect.any(String),
            isMembership: false
        })
    })

    it ("POST Should not create new blog; 401 unauthorized", async () => {
        await request(app)
            .post("/blogs")
            .send(correctBlogDto)
            .expect(401)
    })

    it ("POST Should not create new blog and return error message; 400 bad request", async () => {
        const result = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctBlogDto[0], websiteUrl: "xxxxxx"})
            .expect(400)

        expect(result.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "websiteUrl"
                }
            ]
        })
    })

    it ("GET Should create blog and find by id, 200 ok", async () => {
        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        const foundBlog = await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(200)

        expect(foundBlog.body.name).toEqual(newBlog.body.name)
        expect(foundBlog.body.description).toEqual(newBlog.body.description)
        expect(foundBlog.body.websiteUrl).toEqual(newBlog.body.websiteUrl)
    })

    it("GET Should create blog, delete it by id and do not find it, 404 not found", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(404)
    })

    it ("GET Should return blogs with default pagination, 200 ok", async () => {

        for (let i = 0; i < correctBlogDto.length; i++) {

            await request(app)
                .post("/blogs")
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send(correctBlogDto[i])
                .expect(201)
        }

            const requestResult = await request(app)
                .get(`/blogs`)
                .expect(200)

            expect(requestResult.body.pagesCount).toEqual(1)
            expect(requestResult.body.page).toEqual(1)
            expect(requestResult.body.pageSize).toEqual(10)
            expect(requestResult.body.totalCount).toEqual(10)
            expect(requestResult.body.items).toHaveLength(10)

    })

    it ("GET Should return blogs with query pagination, 200 ok", async () => {

        for (let i = 0; i < correctBlogDto.length; i++) {

            await request(app)
                .post("/blogs")
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send(correctBlogDto[i])
                .expect(201)
        }

        const requestResult = await request(app)
            .get(`/blogs?pageSize=3&pageNumber=2`)
            .expect(200)

        expect(requestResult.body.pagesCount).toEqual(4)
        expect(requestResult.body.page).toEqual(2)
        expect(requestResult.body.pageSize).toEqual(3)
        expect(requestResult.body.totalCount).toEqual(10)
        expect(requestResult.body.items).toHaveLength(3)

    })

    it ("DELETE Should create blog and delete it by id, 204 no content", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(404)
    })

    it ("GET Should not return blogs with pagination because of incorrect query, 400 bad request", async () => {

        for (let i = 0; i < correctBlogDto.length; i++) {

            await request(app)
                .post("/blogs")
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send(correctBlogDto[i])
                .expect(201)
        }

        const requestResult = await request(app)
            .get(`/blogs?pageSize=3&pageNumber=0`)
            .expect(400)

        expect(requestResult.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "pageNumber"
                }
            ]
        })

    })

    it ("DELETE Should create blog and do not delete it, 401 unauthorised", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth("oihnsvon", "iusvbn")
            .expect(401)

        await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(200)
    })

    it ("DELETE Should create blog and do not delete it, 404 not found", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(404)

        await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(404)
    })

    it ("PUT Should update blog, 204 no content", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .put(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctBlogDto[0], name: "new name"})
            .expect(204)

        const updatedBlog = await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(200)

        expect(updatedBlog.body.name).toEqual("new name")
        expect(updatedBlog.body.description).toEqual(newBlog.body.description)
        expect(updatedBlog.body.websiteUrl).toEqual(newBlog.body.websiteUrl)

    })

    it ("PUT Should not update blog because of incorrect dto, 400 bad request", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        const updateResult = await request(app)
            .put(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctBlogDto[0], name: "xxxxxxxxxxxxxxxxxxxxxxxxxx"})
            .expect(400)

        expect(updateResult.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "name"
                }
            ]
        })

    })

    it ("PUT Should not update blog because of unauthorised, 401 unauthorised", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .put(`/blogs/${newBlog.body.id}`)
            .auth("xxx", "xxx")
            .send({...correctBlogDto[0], name: "new name"})
            .expect(401)

    })

    it ("PUT Should not update blog because of not found, 404 not found", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)

        await request(app)
            .put(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctBlogDto[0], name: "new name"})
            .expect(404)

    })

    it ("POST Should create post for blog and return it, 201 created", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        const newPost = await request(app)
            .post(`/blogs/${newBlog.body.id}/posts`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto[0], blogId: newBlog.body.id})
            .expect(201)

        expect(newPost.body.blogId).toEqual(newBlog.body.id)
        expect(newPost.body.title).toEqual(correctPostDto[0].title)
        expect(newPost.body.shortDescription).toEqual(correctPostDto[0].shortDescription)
        expect(newPost.body.content).toEqual(correctPostDto[0].content)

    })

    it ("POST Should not create post because of bad dto, 400 bad request", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        const newPost = await request(app)
            .post(`/blogs/${newBlog.body.id}/posts`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto[0], title: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",blogId: newBlog.body.id})
            .expect(400)

        expect(newPost.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                }
            ]})

    })

    it ("POST Should not create post because of unauthorized, 401 unauthorized", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        const newPost = await request(app)
            .post(`/blogs/${newBlog.body.id}/posts`)
            .send({...correctPostDto[0],blogId: newBlog.body.id})
            .expect(401)

    })

    it ("POST Should not create post because blog does not exist, 404 not found", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .post(`/blogs/${newBlog.body.id}/posts`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto[0],blogId: newBlog.body.id})
            .expect(404)

    })

    it ("GET Should create 10 posts for blog and return them with default pagination, 200 ok", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        for (let i = 0; i < correctPostDto.length; i++) {

            await request(app)
                .post(`/blogs/${newBlog.body.id}/posts`)
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send({...correctPostDto[i], blogId: newBlog.body.id})
                .expect(201)

        }

        const requestResult = await request(app)
            .get(`/blogs/${newBlog.body.id}/posts`)
            .expect(200)

        expect(requestResult.body.pagesCount).toEqual(1)
        expect(requestResult.body.page).toEqual(1)
        expect(requestResult.body.pageSize).toEqual(10)
        expect(requestResult.body.totalCount).toEqual(10)
        expect(requestResult.body.items).toHaveLength(10)

    })

    it ("GET Should create 10 posts for blog and return them with query pagination, 200 ok", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        for (let i = 0; i < correctPostDto.length; i++) {

            await request(app)
                .post(`/blogs/${newBlog.body.id}/posts`)
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send({...correctPostDto[i], blogId: newBlog.body.id})
                .expect(201)

        }

        const requestResult = await request(app)
            .get(`/blogs/${newBlog.body.id}/posts?pageSize=3&pageNumber=3`)
            .expect(200)

        expect(requestResult.body.pagesCount).toEqual(4)
        expect(requestResult.body.page).toEqual(3)
        expect(requestResult.body.pageSize).toEqual(3)
        expect(requestResult.body.totalCount).toEqual(10)
        expect(requestResult.body.items).toHaveLength(3)

    })

    it ("GET Should create posts for blog and do not find them because blog deleted, 404 not found", async () => {

        const newBlog = await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto[0])
            .expect(201)

        for (let i = 0; i < correctPostDto.length; i++) {

            await request(app)
                .post(`/blogs/${newBlog.body.id}/posts`)
                .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
                .send({...correctPostDto[i], blogId: newBlog.body.id})
                .expect(201)

        }

        await request(app)
            .delete(`/blogs/${newBlog.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .get(`/blogs/${newBlog.body.id}/posts?pageSize=3&pageNumber=3`)
            .expect(404)

    })

})