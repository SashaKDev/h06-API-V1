import {UsersRepository} from "../repository/usersRepository";
import {UsersQueryRepository} from "../repository/usersQueryRepository";
import {UsersService} from "../application/usersService";
import {UsersController} from "./handlers/usersController";

export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();

export const usersService = new UsersService(usersRepository);

export const usersController = new UsersController(usersService, usersQueryRepository);