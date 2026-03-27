import {Request, Response} from "express";
import {BlogInputDto} from "../../dto/blog-input.dto.js";
import {BlogsService} from "../../application/blogsService.js";
import {BlogsQueryRepository} from "../../repositories/blogsQueryRepository.js";
import {inject} from "inversify";
import {PostInputDto} from "../../../posts/dto/post-input.dto.js";
import {PostsService} from "../../../posts/application/postsService.js";
import {PostsQueryRepository} from "../../../posts/repositories/postsQueryRepository.js";
import {matchedData} from "express-validator";

export class BlogsController {

    constructor(@inject(BlogsService) protected blogsService: BlogsService,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(PostsService) protected postsService: PostsService,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,) {
    }

    async createBlog(req: Request, res: Response) {

        const newBlog: BlogInputDto = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        }

        const createdBlogId = await this.blogsService.create(newBlog);
        const createdBlogViewModel = await this.blogsQueryRepository.findById(createdBlogId);

        res
            .status(201)
            .json(createdBlogViewModel);

    }

    async createPostForBlog(req: Request, res: Response) {

        const newPost: PostInputDto = {
            blogId: req.params.id,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }
        const insertedPostId = await this.postsService.createForBlog(newPost);
        if (!insertedPostId) {
            res.sendStatus(404);
            return;
        }
        const insertedPost = await this.postsQueryRepository.findById(insertedPostId);
        res
            .status(201)
            .json(insertedPost);

    }

    async deleteBlog(req: Request, res: Response) {

        const deleteResult = await this.blogsService.delete(req.params.id);
        if (!deleteResult) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
    }

    async getAllBlogs(req: Request, res: Response) {

        const data = matchedData(req, {locations: ['query']});
        const pageNumber = Number(data.pageNumber);
        const pageSize = Number(data.pageSize);
        const sortBy = data.sortBy;
        const sortDirection = data.sortDirection;
        const searchNameTerm = data.searchNameTerm;

        const blogsViewModelWithPaginator = await this.blogsQueryRepository.findAll(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
        res
            .status(200)
            .json(blogsViewModelWithPaginator);
    }

    async getBlog(req: Request, res: Response) {
        const foundBlogViewModel = await this.blogsQueryRepository.findById(req.params.id);
        if (!foundBlogViewModel) {
            res.sendStatus(404);
            return;
        }
        res
            .status(200)
            .json(foundBlogViewModel);
    }

    async getBlogPosts(req: Request, res: Response) {

        const data = matchedData(req, {locations: ['query']});

        const foundBlog = await this.blogsQueryRepository.findById(req.params.id);
        if (!foundBlog) {
            res.sendStatus(404);
            return;
        }

        const pageNumber = Number(data.pageNumber);
        const pageSize = Number(data.pageSize);
        const sortDirection = data.sortDirection;
        const sortBy = data.sortBy;

        const foundPosts = await this.postsQueryRepository.findAllForBlog(req.params.id, pageNumber, pageSize, sortBy, sortDirection);

        res
            .status(200)
            .json(foundPosts);

    }

    async updateBlog(req: Request, res: Response) {

        const dto: BlogInputDto = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        }

        const updateResult = await this.blogsService.update(req.params.id, dto);
        if (!updateResult) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);

    }
}