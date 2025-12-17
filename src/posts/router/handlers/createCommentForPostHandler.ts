import {Request, Response} from "express";
import {commentsService} from "../../../comments/application/commenstService";
import {commentsQueryRepository} from "../../../comments/repositories/commentsQueryRepository";


export const createCommentForPostHandler = async (req: Request, res: Response) => {
    const newComment = req.body.content
    const postId = req.params.id
    const newCommentId = await commentsService.createCommentForPost(postId, newComment);
    if (!newCommentId) {
        res.sendStatus(404);
        return;
    }
    const newCommentViewModel = await commentsQueryRepository.findById(newCommentId);
    res
        .status(200)
        .json(newCommentViewModel);
}