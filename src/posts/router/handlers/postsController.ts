import {Request, Response} from "express";
import {CommentsService} from "../../../comments/application/commentsService.js";
import {CommentsQueryRepository} from "../../../comments/repositories/commentsQueryRepository.js";
import {PostInputDto} from "../../dto/post-input.dto.js";
import {PostsService} from "../../application/postsService.js";
import {PostsQueryRepository} from "../../repositories/postsQueryRepository.js";
import {inject} from "inversify";
import {matchedData} from "express-validator";
import {CommentsPaginationData} from "../../../comments/types/commentsPaginationData.js";
import {UsersRepository} from "../../../users/repository/usersRepository.js";
import {PostsLikesRepository} from "../../postsLikes/postsLikesRepository.js";

export class PostsController {

    constructor(@inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(PostsService) protected postsService: PostsService,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(PostsLikesRepository) protected postsLikesRepository: PostsLikesRepository) {
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
        const userId = req.userId;

        const foundPostsWithPaginator = await this.postsQueryRepository.findAll(pageSize, pageNumber, sortDirection, sortBy);

        for (const post of foundPostsWithPaginator.items) {

            if (userId) {

                const foundLike = await this.postsLikesRepository.findLike(userId, post.id)
                if (foundLike) {
                    post.extendedLikesInfo.myStatus = foundLike.status
                }

            }

            const newestLikes = await this.postsLikesRepository.findNewestLikesForPost(post.id, 3)
            console.log(newestLikes)
            for (const like of newestLikes) {
                const user = await this.usersRepository.findById(like.userId)
                if (!user) {
                    post.extendedLikesInfo.newestLikes.push({
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: "deleted user"
                    })
                } else {
                    post.extendedLikesInfo.newestLikes.push({
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: user.login
                    })
                }

            }

        }

        res
            .status(200)
            .json(foundPostsWithPaginator);
    }

    async getCommentsForPost(req: Request, res: Response) {
        const userId = req.userId;
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
        if (!userId) {
            res
                .status(200)
                .json(foundComments);
            return
        }
        const foundUser = await this.usersRepository.findById(userId);
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }

        foundComments.items.forEach(comment => {
            if (foundUser.likesInfo.likes.includes(comment.id)) {
                comment.likesInfo.myStatus = "Like"
            }
            if (foundUser.likesInfo.dislikes.includes(comment.id)) {
                comment.likesInfo.myStatus = "Dislike"
            }
        })

        res
            .status(200)
            .json(foundComments);

    }

    async getPost(req: Request, res: Response) {
        const userId = req.userId;
        const postId = req.params.id;

        const foundPostViewModel = await this.postsQueryRepository.findById(postId);

        if (!foundPostViewModel) {
            res.sendStatus(404);
            return;
        }


        if (userId) {
            const foundLike = await this.postsLikesRepository.findLike(userId, postId);
            if (!foundLike) {
                foundPostViewModel.extendedLikesInfo.myStatus = "None"
            } else {
                foundPostViewModel.extendedLikesInfo.myStatus = foundLike.status;
            }

        }

        const newestLikes = await this.postsLikesRepository.findNewestLikesForPost(postId, 3)
        console.log(newestLikes);
        const mappedNewestLikes = await Promise.all(newestLikes.map(async (like) => {
            const user = await this.usersRepository.findById(like.userId)
            if (!user) {
                return {
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: "deleted user",
                }
            }
            return {
                addedAt: like.createdAt,
                userId: like.userId,
                login: user.login,
            }
        }))
        foundPostViewModel.extendedLikesInfo.newestLikes = mappedNewestLikes;
        console.log(foundPostViewModel)

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

    async changeLikeStatus(req: Request, res: Response) {
        const userId = req.userId as string;
        const likeStatus = req.body.likeStatus;
        const postId = req.params.id;

        const changeResult = await this.postsService.changeLikeStatus(userId, postId, likeStatus);
        if (!changeResult) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }
}