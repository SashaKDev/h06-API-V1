import {Request, Response} from 'express';
import {matchedData} from "express-validator";
import {blogsQueryRepository} from "../../repositories/blogsQueryRepository";

export const getAllBlogsHandler = async (req: Request, res: Response) => {

    const data = matchedData(req, { locations: ['query'] });
    const pageNumber = Number(data.pageNumber);
    const pageSize = Number(data.pageSize);
    const sortBy = data.sortBy;
    const sortDirection = data.sortDirection;
    const searchNameTerm = data.searchNameTerm;

    const blogsViewModelWithPaginator = await blogsQueryRepository.findAll(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res
        .status(200)
        .json(blogsViewModelWithPaginator);
}