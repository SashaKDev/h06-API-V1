import {Request, Response} from "express";
import {usersQueryRepository} from "../../repository/usersQueryRepository";
import {matchedData} from "express-validator";
import {UsersPaginationData} from "../../types/usersPaginationData";

export const getAllUsersHandler = async (req: Request, res: Response) => {

    const data = matchedData(req, { locations: ['query'] });

    const usersPaginationData: UsersPaginationData = {
        pageSize: Number(data.pageSize),
        pageNumber: Number(data.pageNumber),
        sortBy: data.sortBy,
        sortDirection: data.sortDirection,
        searchLoginTerm: data.searchLoginTerm,
        searchEmailTerm: data.searchEmailTerm,
    }

    const usersViewModelWithPaginator = await usersQueryRepository.findAll(usersPaginationData);
    res
        .status(200)
        .json(usersViewModelWithPaginator);
}