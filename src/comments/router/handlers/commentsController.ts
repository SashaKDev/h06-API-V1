import {Request, Response} from "express";
import {CommentsQueryRepository} from "../../repositories/commentsQueryRepository.js";
import {inject} from "inversify";
import {CommentsService} from "../../application/commentsService.js";

export class CommentsController {

    constructor(@inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService) protected commentsService: CommentsService) {
    }

    async getCommentById(req: Request, res: Response) {

        const foundComment = await this.commentsQueryRepository.findById(req.params.id);
        if (!foundComment) {
            res.sendStatus(404);
            return;
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
}