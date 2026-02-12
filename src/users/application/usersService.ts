import {UserInputDto} from "../types/userInputDto";
import {usersRepository} from "../repository/usersRepository";
import {User} from "../types/user";
import {MeViewModel} from "../../auth/types/meViewModel";
import {WithId} from "mongodb";

export const usersService = {

    async findMeById(id: string): Promise<MeViewModel> {
        const foundUser = await usersRepository.findById(id) as WithId<User>;
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser._id.toString(),
        }
    },

    async create (newUserDto: UserInputDto): Promise<string> {
        const isLoginUnique = await usersRepository.isLoginUnique(newUserDto.login);
        const isEmailUnique = await usersRepository.isEmailUnique(newUserDto.email)
        if(isLoginUnique) {
            throw new Error('login should be unique');
        }
        if(isEmailUnique) {
            throw new Error('email should be unique');
        }
        const newUser: User = {
            login: newUserDto.login,
            password: newUserDto.password,
            email: newUserDto.email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: new Date(),
                isConfirmed: false,
            }
        }
        return await usersRepository.create(newUser)
    },

    async deleteById (id: string): Promise<number> {
        return await usersRepository.deleteById(id)
    }
}