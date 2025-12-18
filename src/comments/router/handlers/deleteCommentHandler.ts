import {Request, Response} from "express";
import {commentsService} from "../../application/commenstService";

export const deleteCommentHandler = async (req: Request, res: Response) => {
    let deleteResult;
    try {
        deleteResult = await commentsService.delete(req.params.id, req.userId!);
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