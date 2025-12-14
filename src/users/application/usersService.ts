import {UserInputDto} from "../types/userInputDto";
import {usersRepository} from "../repository/usersRepository";

export const usersService = {

    async create (newUserDto: UserInputDto): Promise<string> {
        const isLoginUnique = await usersRepository.isLoginUnique(newUserDto.login);
        const isEmailUnique = await usersRepository.isEmailUnique(newUserDto.email)
        if(isLoginUnique) {
            throw new Error('login should be unique');
        }
        if(isEmailUnique) {
            throw new Error('email should be unique');
        }
        const newUser = {
            login: newUserDto.login,
            password: newUserDto.password,
            email: newUserDto.email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.create(newUser)
    },

    async deleteById (id: string): Promise<number> {
        return await usersRepository.deleteById(id)
    }
}