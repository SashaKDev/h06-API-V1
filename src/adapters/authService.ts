import {usersRepository} from "../users/repository/usersRepository";
import bcrypt from "bcrypt";
import {jwtService} from "./jwtService";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {User} from "../users/types/user";
import {isBefore} from "date-fns";
import {mailService} from "./mailService";

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

    async registerUser (login: string, password: string, email: string): Promise<string> {
        const hashPassword = await bcrypt.hash(password, 10);

        const userByLogin = await usersRepository.findByLoginOrEmail(login);
        if (userByLogin.length !== 0) {
            console.log(userByLogin);
            throw new Error("login already exists");
        }

        const userByEmail = await usersRepository.findByLoginOrEmail(email);
        if (userByEmail.length !== 0) {
            console.log(userByEmail);
            throw new Error("email already exists");
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
                    hours: 1,
                    minutes: 25,
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

    },

    async resendConfirmationCode (email: string): Promise<number | null> {

        const foundUser = (await usersRepository.findByLoginOrEmail(email))[0];

        if (!foundUser) {
            throw new Error("email does not exist");
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            throw new Error('email already confirmed');
        }

        const newVerificationCode = randomUUID();
        const updateCodeResult = await usersRepository.updateConfirmationCode(foundUser.email, newVerificationCode);
        if (!updateCodeResult) {
            return null;
        }
        await mailService.sendMail(email, newVerificationCode);
        return updateCodeResult;

    }

}
