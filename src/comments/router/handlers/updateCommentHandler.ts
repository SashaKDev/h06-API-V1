import {Request, Response} from "express";
import {commentsService} from "../../application/commenstService";

export const updateCommentHandler = async (req: Request, res: Response) => {

    const foundComment = await commentsService.findById(req.params.id);
    if (!foundComment) {
        res.sendStatus(404);
        return;
    }
    const updateResult = await commentsService.updateComment(req.params.id, req.body.content);
    if (updateResult === 1) {
        res.sendStatus(204);
        return;
    }
}