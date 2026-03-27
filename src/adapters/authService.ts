import bcrypt from "bcrypt";
import {jwtService} from "./jwtService.js";
import {randomUUID} from "crypto";
import {add} from "date-fns";

import {isBefore} from "date-fns";
import {MailService} from "./mailService.js";
import {LoginTokensType} from "../auth/types/loginTokensType.js";
import {SessionType} from "../auth/types/sessionType.js";
import {sessionsCollection} from "../db/mongo.db.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import {UsersRepository} from "../users/repository/usersRepository.js";
import {inject, injectable} from "inversify";
import {User} from "../users/types/user.js";

@injectable()
export class AuthService {

    constructor(@inject(MailService) protected mailService: MailService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,) {}

    async loginUser (loginOrEmail: string, password: string, deviceName: string, ip: string): Promise<LoginTokensType | null> {
        const foundUser = (await this.usersRepository.findByLoginOrEmail(loginOrEmail))[0];
        if (!foundUser) {
            return null;
        }
        const passwordCheckResult = await bcrypt.compare(password, foundUser.password);
        if (!passwordCheckResult) {
            return null;
        }

        const deviceId = randomUUID();

        const jwtToken = await jwtService.createJWT(foundUser._id.toString());
        const refreshToken = await jwtService.createRefreshToken(foundUser._id.toString(), deviceId);

        const decodedPayload = jwt.decode(refreshToken) as JwtPayload;
        const iat = decodedPayload.iat as number;
        console.log("iat");
        console.log(iat);

        const session: SessionType = {

            userId: foundUser._id.toString(),
            deviceId: deviceId,
            deviceName: deviceName,
            iat: iat,
            ip: ip,
            createdAt: new Date(),

        }

        await sessionsCollection.insertOne(session);

        return {jwtToken: jwtToken, refreshToken: refreshToken};
    }

    async registerUser (login: string, password: string, email: string): Promise<void> {
        const hashPassword = await bcrypt.hash(password, 10);

        const userByLogin = await this.usersRepository.findByLoginOrEmail(login);
        if (userByLogin.length !== 0) {
            console.log(userByLogin);
            throw new Error("login already exists");
        }

        const userByEmail = await this.usersRepository.findByLoginOrEmail(email);
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
            },
            recoveryCode: {
                iat: 0
            }
        }

        const insertResult = await this.usersRepository.create(newUser);

        await this.mailService.sendMail(email, confirmationCode);

    }

    async recoverPassword (email: string): Promise<void | null> {
        const foundUser = await this.usersRepository.findByLoginOrEmail(email);
        if (foundUser.length === 0) {
            return null
        }
        const recoveryCode = await jwtService.createRecoveryCode(foundUser[0]._id.toString());
        const recoveryCodeIat = jwt.decode(recoveryCode) as {userId: string, iat: number};
        await this.mailService.sendPasswordRecoveryMail(email, recoveryCode)
        await this.usersRepository.updateRecoveryCodeIat(recoveryCodeIat.userId, recoveryCodeIat.iat)

    }

    async updatePassword (recoveryCode: string, newPassword: string): Promise<void | null> {
        const userId = await jwtService.verifyJWT(recoveryCode)
        if (!userId) {
            return null
        }
        const iat = (jwt.decode(recoveryCode) as {iat: number}).iat;
        const foundUser = await this.usersRepository.findById(userId);
        if (!foundUser) {
            return null;
        }

        if (foundUser.recoveryCode.iat !== iat) {
            return null
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashNewPassword);

        await this.usersRepository.updatePassword(userId, hashNewPassword);
        await this.usersRepository.updateRecoveryCodeIat(userId, 0)

    }

    async validateConfirmationCode (confirmationCode: string): Promise<number | null> {
        console.log(confirmationCode);

        const foundUser = await this.usersRepository.findByConfirmationCode(confirmationCode);
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

        const updateResult = await this.usersRepository.updateConfirmationStatus(foundUser.email)
        if (!updateResult) {
            return null;
        }

        return updateResult;

    }

    async resendConfirmationCode (email: string): Promise<number | null> {

        const foundUser = (await this.usersRepository.findByLoginOrEmail(email))[0];

        if (!foundUser) {
            throw new Error("email does not exist");
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            throw new Error('email already confirmed');
        }

        const newVerificationCode = randomUUID();
        const updateCodeResult = await this.usersRepository.updateConfirmationCode(foundUser.email, newVerificationCode);
        if (!updateCodeResult) {
            return null;
        }
        await this.mailService.sendMail(email, newVerificationCode);
        return updateCodeResult;

    }

    async refreshJWTandRefreshToken(oldRefreshToken: string): Promise<LoginTokensType | null> {

        const verifyResult = await jwtService.verifyRefreshToken(oldRefreshToken);

        if (!verifyResult) {
            return null;
        }

        const userId = verifyResult.userId;
        const deviceId = verifyResult.deviceId;

        const session = await sessionsCollection.findOne({
            userId: userId,
            deviceId: deviceId,
        })

        if (!session) {
            return null;
        }

        const oldRtPayload = jwt.decode(oldRefreshToken) as JwtPayload;
        const oldRtIat = oldRtPayload.iat as number;

        if (oldRtIat !== session.iat) {
            console.log("bad rt");
            return null;
        }

        const newJwtToken = await jwtService.createJWT(userId);
        const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId);

        const newRtPayload = jwt.decode(newRefreshToken) as JwtPayload;
        const newRtIat = newRtPayload.iat as number;

        await sessionsCollection.updateOne(
            {
            userId: userId,
            deviceId: deviceId,
            },
            {$set:
                    {
                        iat: newRtIat,
                    }
            }
        );

        return {jwtToken: newJwtToken, refreshToken: newRefreshToken};

    }

}
