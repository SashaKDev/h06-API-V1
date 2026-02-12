import {Request, Response} from "express";
import {UserInputDto} from "../../types/userInputDto";
import {usersService} from "../../application/usersService";
import {usersQueryRepository} from "../../repository/usersQueryRepository";
import bcrypt from 'bcrypt'

export const createUserHandler = async (req: Request, res: Response) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUserDto: UserInputDto = {
        login: req.body.login,
        password: hashPassword,
        email: req.body.email,
    };
    let newUserId;
    try {
        newUserId = await usersService.create(newUserDto);
    } catch (error: any) {
        const field = error.message.split(" ")[0];
        res
            .status(400)
            .send({field: field, message: error.message});
        return;
    }
    const newUser = await usersQueryRepository.findById(newUserId);

    res
        .status(201)
        .json(newUser);
}