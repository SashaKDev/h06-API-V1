import {setupApp} from "../../../src/setup-app";
import {MongoClient, ObjectId} from "mongodb";
import {runDb} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";
import request from "supertest";
import {BlogInputDto} from "../../../src/blogs/dto/blog-input.dto";
import {PostInputDto} from "../../../src/posts/dto/post-input.dto";
import {BlogViewModel} from "../../../src/blogs/types/blogsViewModel";

// ДОПИСАТЬ ДЛЯ КОММЕНТОВ ДЛЯ ПОСТОВ

describe ("posts test", () => {

    const app = setupApp();
    let client: MongoClient;

    const correctBlogDto: BlogInputDto = {
        name: `Blog 1`,
        description: `Blog 1 description`,
        websiteUrl: `https://blog1.com`,
    }


    beforeAll(async () => {
        client = await runDb(SETTINGS.MONGO_URL)
    })

    let newBlog: BlogViewModel;

    beforeEach(async () => {
        await request(app)
            .delete("/testing/all-data")
            .expect(204)

        newBlog = (await request(app)
            .post("/blogs")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send(correctBlogDto)
            .expect(201)).body

    })

    afterAll(async () => {
        await client.close();
    })



    const correctPostDto: PostInputDto = {
        title: "post 1",
        shortDescription: "short description 1",
        content: "some content 1",
        blogId: "1"
    }

    it ("POST Should create new post and return it, 201 created", async () => {




        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        expect(newPost.body.blogId).toEqual(newBlog.id)
        expect(newPost.body.title).toEqual(correctPostDto.title)
        expect(newPost.body.shortDescription).toEqual(correctPostDto.shortDescription)
        expect(newPost.body.content).toEqual(correctPostDto.content)

    })

    it ("POST Should not create new post and return error message, 400 bad input", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id, title: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"})
            .expect(400)

        expect(newPost.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                }
            ]
        })

    })

    it ("POST Should not create new post because of unauthorized, 401 unauthorized", async () => {

        await request(app)
            .post("/posts")
            .send({...correctPostDto, blogId: newBlog.id, title: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"})
            .expect(401)

    })

    it ("POST Should not create new post because of nonexistent blog, 404 not found", async () => {

        await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: "6995966fc0999a8019f390df"})
            .expect(404)

    })

    it ("GET Should create post and find it by postId, 200 ok", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        const foundPost = await request(app)
            .get(`/posts/${newPost.body.id}`)
            .expect(200)

        expect(foundPost.body.id).toEqual(newPost.body.id)
        expect(foundPost.body.title).toEqual(newPost.body.title)
        expect(foundPost.body.shortDescription).toEqual(newPost.body.shortDescription)
        expect(foundPost.body.content).toEqual(newPost.body.content)
        expect(foundPost.body.blogId).toEqual(newPost.body.blogId)

    })

    it ("GET not find new post because of nonexistent id, 404 not found", async () => {

        await request(app)
            .get(`/posts/6995966fc0999a8019f390df`)
            .expect(404)

    })

    it ("PUT Should update post by postId, 204 no content", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        await request(app)
            .put(`/posts/${newPost.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id,title: "updated title"})
            .expect(204)

        const foundPost = await request(app)
            .get(`/posts/${newPost.body.id}`)
            .expect(200)

        expect(foundPost.body.id).toEqual(newPost.body.id)
        expect(foundPost.body.title).toEqual("updated title")
        expect(foundPost.body.shortDescription).toEqual(newPost.body.shortDescription)

    })

    it ("PUT Should not update post because of bad title, 400 bad request", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        const updateResult = await request(app)
            .put(`/posts/${newPost.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id,title: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"})
            .expect(400)

        expect(updateResult.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                }
            ]
        })

    })

    it ("PUT Should not update post because of unauthorized, 401 unauthorized", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        await request(app)
            .put(`/posts/${newPost.body.id}`)
            .send({...correctPostDto, blogId: newBlog.id,title: "updated title"})
            .expect(401)
    })

    it ("PUT Should not update nonexistent post, 404 not found", async () => {

        await request(app)
            .put("/posts/6995966fc0999a8019f390df")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id,title: "updated title"})
            .expect(404)

    })

    it ("DELETE Should delete post by postId, 204 no content", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        await request(app)
            .get(`/posts/${newPost.body.id}`)
            .expect(200)

        await request(app)
            .delete(`/posts/${newPost.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .get(`/posts/${newPost.body.id}`)
            .expect(404)

    })

    it ("DELETE Should not delete post because of unauthorized, 401 unauthorized", async () => {

        await request(app)
            .delete("/posts/6995966fc0999a8019f390df")
            .expect(401)

    })

    it ("DELETE Should not delete nonexistent post, 404 not found", async () => {

        const newPost = await request(app)
            .post("/posts")
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .send({...correctPostDto, blogId: newBlog.id})
            .expect(201)

        await request(app)
            .delete(`/posts/${newPost.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(204)

        await request(app)
            .delete(`/posts/${newPost.body.id}`)
            .auth(SETTINGS.USERNAME, SETTINGS.PASSWORD)
            .expect(404)

    })

})