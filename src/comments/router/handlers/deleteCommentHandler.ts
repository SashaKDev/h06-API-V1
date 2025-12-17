import {Request, Response} from "express";
import {commentsService} from "../../application/commenstService";

export const deleteCommentHandler = async (req: Request, res: Response) => {

    const deleteResult = await commentsService.delete(req.params.id);
    if (deleteResult === 0) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}