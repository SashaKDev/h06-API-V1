import {Request, Response} from "express";
import {CommentsService} from "../../../comments/application/commentsService.js";
import {CommentsQueryRepository} from "../../../comments/repositories/commentsQueryRepository.js";
import {PostInputDto} from "../../dto/post-input.dto.js";
import {PostsService} from "../../application/postsService.js";
import {PostsQueryRepository} from "../../repositories/postsQueryRepository.js";
import {inject} from "inversify";
import {matchedData} from "express-validator";
import {CommentsPaginationData} from "../../../comments/types/commentsPaginationData.js";

export class PostsController {

    constructor(@inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(PostsService) protected postsService: PostsService,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository) {
    }

    async createCommentForPost(req: Request, res: Response) {
        const newComment = req.body.content
        const postId = req.params.id
        const userId = req.userId!;
        const newCommentId = await this.commentsService.createCommentForPost(postId, newComment, userId);
        // console.log(newCommentId + "123")
        if (!newCommentId) {
            res.sendStatus(404);
            return;
        }
        const newCommentViewModel = await this.commentsQueryRepository.findById(newCommentId);
        res
            .status(201)
            .json(newCommentViewModel);
    }

    async createPost(req: Request, res: Response) {

        const newPost: PostInputDto = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }
        const createdPostId = await this.postsService.create(newPost);
        if (!createdPostId) {
            res.sendStatus(404)
            return;
        }
        const createdPost = await this.postsQueryRepository.findById(createdPostId);
        res
            .status(201)
            .json(createdPost);
    }

    async deletePost(req: Request, res: Response) {

        const deleteResult: number = await this.postsService.delete(req.params.id);
        if (deleteResult === 0) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);

    }

    async getAllPosts(req: Request, res: Response) {

        const data = matchedData(req, {locations: ['query']});

        const pageSize = Number(data.pageSize);
        const pageNumber = Number(data.pageNumber);
        const sortBy = data.sortBy;
        const sortDirection = data.sortDirection;

        const foundPostsWithPaginator = await this.postsQueryRepository.findAll(pageSize, pageNumber, sortDirection, sortBy);

        res
            .status(200)
            .json(foundPostsWithPaginator);
    }

    async getCommentsForPost(req: Request, res: Response) {

        const data = matchedData(req, {locations: ['query']});

        const commentsPaginationData: CommentsPaginationData = {
            pageSize: Number(data.pageSize),
            pageNumber: Number(data.pageNumber),
            sortBy: data.sortBy,
            sortDirection: data.sortDirection,
        }
        const foundPost = await this.postsService.findById(req.params.id);
        if (!foundPost) {
            res.sendStatus(404);
            return;
        }
        const foundComments = await this.commentsQueryRepository.findCommentsForPost(req.params.id, commentsPaginationData);
        res
            .status(200)
            .json(foundComments);

    }

    async getPost(req: Request, res: Response) {
        const foundPostViewModel = await this.postsQueryRepository.findById(req.params.id);
        if (!foundPostViewModel) {
            res.sendStatus(404);
            return;
        }
        res
            .status(200)
            .json(foundPostViewModel);
    }

    async updatePost(req: Request, res: Response) {

        const dto: PostInputDto = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }
        const updateResult: number = await this.postsService.update(req.params.id, dto);
        if (!updateResult) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);

    }
}