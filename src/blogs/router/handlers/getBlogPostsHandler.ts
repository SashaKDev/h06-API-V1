import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {blogsQueryRepository} from "../../repositories/blogsQueryRepository";
import {postsQueryRepository} from "../../../posts/repositories/postsQueryRepository";

export const getBlogPostsHandler = async (req: Request, res: Response) => {

    const data = matchedData(req, { locations: ['query'] });

    const foundBlog = await blogsQueryRepository.findById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }

    const pageNumber = Number(data.pageNumber);
    const pageSize = Number(data.pageSize);
    const sortDirection = data.sortDirection;
    const sortBy = data.sortBy;

    const foundPosts = await postsQueryRepository.findAllForBlog(req.params.id, pageNumber, pageSize, sortBy, sortDirection);

    res
        .status(200)
        .json(foundPosts);

}