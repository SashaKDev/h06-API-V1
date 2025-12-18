import {Request, Response} from "express";
import {commentsService} from "../../../comments/application/commenstService";
import {commentsQueryRepository} from "../../../comments/repositories/commentsQueryRepository";


export const createCommentForPostHandler = async (req: Request, res: Response) => {
    const newComment = req.body.content
    const postId = req.params.id
    const userId = req.userId!;
    const newCommentId = await commentsService.createCommentForPost(postId, newComment, userId);
    // console.log(newCommentId + "123")
    if (!newCommentId) {
        res.sendStatus(404);
        return;
    }
    const newCommentViewModel = await commentsQueryRepository.findById(newCommentId);
    res
        .status(201)
        .json(newCommentViewModel);
}