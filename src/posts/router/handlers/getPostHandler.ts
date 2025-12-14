import {Request, Response} from 'express';
import {postsQueryRepository} from "../../repositories/postsQueryRepository";

export const getPostHandler = async (req: Request, res: Response) => {
    const foundPostViewModel = await postsQueryRepository.findById(req.params.id);
    if (!foundPostViewModel) {
        res.sendStatus(404);
        return;
    }
    res
        .status(200)
        .json(foundPostViewModel);
}