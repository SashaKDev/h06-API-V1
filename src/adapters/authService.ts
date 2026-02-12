import {usersRepository} from "../users/repository/usersRepository";
import bcrypt from "bcrypt";
import {jwtService} from "./jwtService";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {User} from "../users/types/user";

export const authService = {

    async loginUser (loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser = (await usersRepository.findByLoginOrEmail(loginOrEmail))[0];
        if (!foundUser) {
            return null;
        }
        const passwordCheckResult = await bcrypt.compare(password, foundUser.password);
        if (!passwordCheckResult) {
            return null;
        }
        return await jwtService.createJWT(foundUser._id.toString());
    },

    async registerUser (login: string, password: string, email: string): Promise<string | null> {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(111111111111111111);

        const userByLogin = await usersRepository.findByLoginOrEmail(login);
        if (userByLogin.length !== 0) {
            console.log(userByLogin);
            return null;
        }

        const userByEmail = await usersRepository.findByLoginOrEmail(email);
        if (userByEmail.length !== 0) {
            console.log(userByEmail);
            return null;
        }

        const newUser: User = {
            login: login,
            password: hashPassword,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 25,
                }),
                isConfirmed: false,
            }
        }
        console.log(newUser);

        console.log(newUser);

        const insertResult = await usersRepository.create(newUser);
        console.log(insertResult);
        return insertResult;

    }

}
