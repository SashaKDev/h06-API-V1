import {usersRepository} from "../users/repository/usersRepository";
import bcrypt from "bcrypt";
import {jwtService} from "./jwtService";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {User} from "../users/types/user";
import {isBefore} from "date-fns";

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
        const confirmationCode = randomUUID();
        const newUser: User = {
            login: login,
            password: hashPassword,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), {
                    hours: 0,
                    minutes: 1,
                }),
                isConfirmed: false,
            }
        }

        const insertResult = await usersRepository.create(newUser);

        return confirmationCode;

    },

    async validateConfirmationCode (confirmationCode: string): Promise<number | null> {
        console.log(confirmationCode);

        const foundUser = await usersRepository.findByConfirmationCode(confirmationCode);
        console.log(foundUser);
        if (!foundUser) {
            return null;
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            return null
        }

        if (!isBefore(new Date(), foundUser.emailConfirmation.expirationDate)) {
            return null;
        }

        const updateResult = await usersRepository.updateConfirmationStatus(foundUser.email)
        if (!updateResult) {
            return null;
        }

        return updateResult;

    }

}
