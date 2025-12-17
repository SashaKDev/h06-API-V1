import {Request, Response} from "express";
import {commentsQueryRepository} from "../../repositories/commentsQueryRepository";

export const getCommentByIdHandler = async (req: Request, res: Response) => {

    const foundComment = await commentsQueryRepository.findById(req.params.id);
    if (!foundComment) {
        res.sendStatus(404);
        return;
    }
    res
        .status(200)
        .json(foundComment);
}