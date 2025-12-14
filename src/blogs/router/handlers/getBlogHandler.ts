import {Request, Response} from 'express';
import {blogsQueryRepository} from "../../repositories/blogsQueryRepository";

export const getBlogHandler = async (req: Request, res: Response) => {
    const foundBlogViewModel = await blogsQueryRepository.findById(req.params.id);
    if (!foundBlogViewModel) {
        res.sendStatus(404);
        return;
    }
    res
        .status(200)
        .json(foundBlogViewModel);
}