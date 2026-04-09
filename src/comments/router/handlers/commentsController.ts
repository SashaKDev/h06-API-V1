import {Request, Response} from "express";
import {CommentsQueryRepository} from "../../repositories/commentsQueryRepository.js";
import {inject} from "inversify";
import {CommentsService} from "../../application/commentsService.js";
import {UsersRepository} from "../../../users/repository/usersRepository.js";

export class CommentsController {

    constructor(@inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,) {
    }

    async getCommentById(req: Request, res: Response) {

        const userId = req.userId;
        console.log(userId);
        const commentId = req.params.id;

        const foundComment = await this.commentsQueryRepository.findById(commentId);
        if (!foundComment) {
            res.sendStatus(404);
            return;
        }
        if (!userId) {
            res
                .status(200)
                .json(foundComment)
            return;
        }
        const foundUser = await this.usersRepository.findById(userId)
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        if (foundUser.likesInfo.likes.includes(commentId)) {
            const foundCommentClone = structuredClone(foundComment);
            foundCommentClone.likesInfo.myStatus = "Like"
            console.log(foundCommentClone)
            res
                .status(200)
                .json(foundCommentClone);
            return
        }
        if (foundUser.likesInfo.dislikes.includes(commentId)) {
            const foundCommentClone = structuredClone(foundComment);
            foundCommentClone.likesInfo.myStatus = "Dislike"
            console.log(foundCommentClone)
            res
                .status(200)
                .json(foundCommentClone);
            return
        }
        res
            .status(200)
            .json(foundComment);
    }

    async updateComment(req: Request, res: Response) {

        const foundComment = await this.commentsService.findById(req.params.id);
        if (!foundComment) {
            res.sendStatus(404);
            return;
        }
        if (foundComment.userId !== req.userId) {
            res.sendStatus(403);
            return;
        }
        const updateResult = await this.commentsService.updateComment(req.params.id, req.body.content);
        if (updateResult === 1) {
            res.sendStatus(204);
            return;
        }
    }

    async deleteComment(req: Request, res: Response) {
        let deleteResult;
        try {
            deleteResult = await this.commentsService.delete(req.params.id, req.userId!);
        } catch (e) {
            res.sendStatus(403);
            return;
        }
        if (deleteResult === 0) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

    async changeLikeStatus(req: Request, res: Response) {
        const commentId = req.params.id;
        const likeStatus = req.body.likeStatus;
        const userId = req.userId as string;
        const changeResult = await this.commentsService.changeLikeStatus(commentId, likeStatus, userId);
        if (!changeResult) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }
}