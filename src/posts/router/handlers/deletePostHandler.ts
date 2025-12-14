import {Request, Response} from 'express';
import {postsService} from "../../application/postsService";

export const deletePostHandler = async (req: Request, res: Response) => {

    const deleteResult: number = await postsService.delete(req.params.id);
    if (!deleteResult) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);

}