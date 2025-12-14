import {Request, Response} from "express";
import {blogsService} from "../../application/blogsService";

export const deleteBlogHandler = async (req: Request, res: Response) => {

    const deleteResult = await blogsService.delete(req.params.id);
    if (!deleteResult) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
}