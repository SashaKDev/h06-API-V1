import {UserInputDto} from "../types/userInputDto.js";
import {UsersRepository} from "../repository/usersRepository.js";
import {User} from "../types/user.js";
import {MeViewModel} from "../../auth/types/meViewModel.js";
import {WithId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {

    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {
    }

    async findMeById(id: string): Promise<MeViewModel | null> {
        const foundUser = await this.usersRepository.findById(id);
        if (!foundUser) {
            return null;
        }
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser._id.toString(),
        }
    }

    async create(newUserDto: UserInputDto): Promise<string> {
        const isLoginUnique = await this.usersRepository.isLoginUnique(newUserDto.login);
        const isEmailUnique = await this.usersRepository.isEmailUnique(newUserDto.email)
        if (isLoginUnique) {
            throw new Error('login should be unique');
        }
        if (isEmailUnique) {
            throw new Error('email should be unique');
        }
        const newUser: User = {
            login: newUserDto.login,
            password: newUserDto.password,
            email: newUserDto.email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: " ",
                expirationDate: new Date(),
                isConfirmed: false,
            },
            recoveryCode: {
                iat: 0
            },
            likesInfo: {
                likes: [" "],
                dislikes: [" "]
            }
        }
        return await this.usersRepository.create(newUser)
    }

    async deleteById(id: string): Promise<number> {
        return await this.usersRepository.deleteById(id)
    }

}

// export const usersService = {
//
//     async findMeById(id: string): Promise<MeViewModel> {
//         const foundUser = await usersRepository.findById(id) as WithId<User>;
//         return {
//             email: foundUser.email,
//             login: foundUser.login,
//             userId: foundUser._id.toString(),
//         }
//     },
//
//     async create (newUserDto: UserInputDto): Promise<string> {
//         const isLoginUnique = await usersRepository.isLoginUnique(newUserDto.login);
//         const isEmailUnique = await usersRepository.isEmailUnique(newUserDto.email)
//         if(isLoginUnique) {
//             throw new Error('login should be unique');
//         }
//         if(isEmailUnique) {
//             throw new Error('email should be unique');
//         }
//         const newUser: User = {
//             login: newUserDto.login,
//             password: newUserDto.password,
//             email: newUserDto.email,
//             createdAt: new Date().toISOString(),
//             emailConfirmation: {
//                 confirmationCode: "",
//                 expirationDate: new Date(),
//                 isConfirmed: false,
//             }
//         }
//         return await usersRepository.create(newUser)
//     },
//
//     async deleteById (id: string): Promise<number> {
//         return await usersRepository.deleteById(id)
//     }
// }