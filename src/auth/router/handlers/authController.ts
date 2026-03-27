import {Request, Response} from "express";
import {getDeviceTitle} from "../../../adapters/getDeviceTitle.js";
import {AuthService} from "../../../adapters/authService.js";
import jwt from "jsonwebtoken";
import {sessionsCollection} from "../../../db/mongo.db.js";
import {UsersQueryRepository} from "../../../users/repository/usersQueryRepository.js";
import {inject} from "inversify";

export class AuthController {

    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(AuthService) protected authService: AuthService,
    ) {}

    async getUserInfoHandler(req: Request, res: Response) {
        const userAuthInfo = await this.usersQueryRepository.findUserAuthInfo(req.userId!);
        if (!userAuthInfo) {
            res.sendStatus(404);
            return;
        }
        res
            .status(200)
            .json(userAuthInfo);
    }

    async loginHandler(req: Request, res: Response) {

        const loginOrEmail = req.body.loginOrEmail;
        const password = req.body.password;
        const userAgent = req.headers['user-agent'];

        const title = getDeviceTitle(userAgent);
        const ip = req.ip ? req.ip : "0:0:0:0";
        console.log(title);
        console.log(ip);


        const authResult = await this.authService.loginUser(loginOrEmail, password, title, ip);

        if (!authResult) {
            res.sendStatus(401);
            return;
        }

        const jwtToken = authResult.jwtToken;
        const refreshToken = authResult.refreshToken;

        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        res
            .status(200)
            .json({
                accessToken: jwtToken,
            })

    }

    async logoutHandler(req: Request, res: Response) {

        const oldRefreshToken = req.cookies.refreshToken;

        const {userId, deviceId} = jwt.decode(oldRefreshToken) as { userId: string, deviceId: string };

        await sessionsCollection.deleteOne({userId: userId, deviceId: deviceId});

        res.sendStatus(204);


    }

    async newPasswordHandler(req: Request, res: Response) {

        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode;
        const updateResult = await this.authService.updatePassword(recoveryCode, newPassword);
        if (updateResult === null) {
            res
                .status(400)
                .json({errorsMessages: [{message: "invalid recovery code", field: "recoveryCode"}]})
            return;
        }
        res.sendStatus(204);

    }

    async passwordRecoveryHandler(req: Request, res: Response) {

        const email = req.body.email;
        await this.authService.recoverPassword(email);
        res.sendStatus(204);

    }

    async refreshTokenHandler(req: Request, res: Response) {

        // ВЫНЕСТИ ПРОВЕРКУ REFRESHTOKEN В МИДЛВАРУ

        const oldRefreshToken = req.cookies.refreshToken;

        const newTokens = await this.authService.refreshJWTandRefreshToken(oldRefreshToken);

        if (!newTokens) {
            res.sendStatus(401);
            return;
        }
        res.cookie("refreshToken", newTokens.refreshToken, {httpOnly: true, secure: true});
        res
            .status(200)
            .json({
                accessToken: newTokens.jwtToken,
            });

    }

    async registrationConfirmationHandler(req: Request, res: Response) {

        const confirmationCode = req.body.code;
        console.log(confirmationCode);

        const codeConfirmationResult = await this.authService.validateConfirmationCode(confirmationCode);
        if (!codeConfirmationResult) {
            res.status(400)
                .json({
                    "errorsMessages": [
                        {
                            "message": "Invalid code",
                            "field": "code",
                        }
                    ]
                });
            return;
        }
        res.sendStatus(204);


    }

    async registrationEmailResendingHandler(req: Request, res: Response) {

        const email = req.body.email;

        try {
            await this.authService.resendConfirmationCode(email);
        } catch (error: any) {
            res
                .status(400)
                .json({
                    "errorsMessages": [
                        {
                            "message": error.message,
                            "field": "email"
                        }
                    ]
                })
            return;
        }
        res.sendStatus(204)

    }

    async registrationHandler(req: Request, res: Response) {

        const login = req.body.login;
        const password = req.body.password;
        const email = req.body.email;

        // НОРМАЛЬНО ЛИ ВРУЧНУЮ ОТПРАВЛЯТЬ ОШИБКУ
        // ЕСЛИ НЕТ ТО КАК ЕЕ ЗАКИНУТЬ К ОСТАЛЬНЫМ ОШИБКАМ
        try {
            await this.authService.registerUser(login, password, email);
        } catch (error: any) {
            const field = error.message.split(" ")[0];
            res
                .status(400)
                .json({errorsMessages: [{message: error.message, field: field}]});
            return;
        }

        res
            .sendStatus(204)
    }


}