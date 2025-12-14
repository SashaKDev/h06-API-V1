import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {postsQueryRepository} from "../../repositories/postsQueryRepository";

export const getAllPostsHandler = async (req: Request, res: Response) => {

    const data = matchedData(req, { locations: ['query'] });

    const pageSize = Number(data.pageSize);
    const pageNumber = Number(data.pageNumber);
    const sortBy = data.sortBy;
    const sortDirection = data.sortDirection;

    const foundPostsWithPaginator = await postsQueryRepository.findAll(pageSize, pageNumber, sortDirection, sortBy);

    res
        .status(200)
        .json(foundPostsWithPaginator);
}