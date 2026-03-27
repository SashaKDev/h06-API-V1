import {UsersQueryRepository} from "../../repository/usersQueryRepository.js";
import {UsersService} from "../../application/usersService.js";
import {Request, Response} from "express";
import bcrypt from "bcrypt";
import {UserInputDto} from "../../types/userInputDto.js";
import {matchedData} from "express-validator";
import {UsersPaginationData} from "../../types/usersPaginationData.js";
import {inject} from "inversify";

export class UsersController {

    constructor(@inject(UsersService) protected usersService: UsersService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    async createUser(req: Request, res: Response) {
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const newUserDto: UserInputDto = {
            login: req.body.login,
            password: hashPassword,
            email: req.body.email,
        };
        let newUserId;
        try {
            newUserId = await this.usersService.create(newUserDto);
        } catch (error: any) {
            console.log(error)
            const field = error.message.split(" ")[0];
            res
                .status(400)
                .send({field: field, message: error.message});
            return;
        }
        const newUser = await this.usersQueryRepository.findById(newUserId);

        res
            .status(201)
            .json(newUser);
    }

    async deleteUser(req: Request, res: Response) {

        const deleteResult = await this.usersService.deleteById(req.params.id);
        if (deleteResult === 0) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

    async getAllUsers(req: Request, res: Response) {

        const data = matchedData(req, {locations: ['query']});

        const usersPaginationData: UsersPaginationData = {
            pageSize: Number(data.pageSize),
            pageNumber: Number(data.pageNumber),
            sortBy: data.sortBy,
            sortDirection: data.sortDirection,
            searchLoginTerm: data.searchLoginTerm,
            searchEmailTerm: data.searchEmailTerm,
        }

        const usersViewModelWithPaginator = await this.usersQueryRepository.findAll(usersPaginationData);
        res
            .status(200)
            .json(usersViewModelWithPaginator);
    }
}