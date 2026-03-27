// import {Request, Response} from "express";
// import {authService} from "../../../adapters/authService";
//
// export const refreshTokenHandler = async (req: Request, res: Response) => {
//
//     // ВЫНЕСТИ ПРОВЕРКУ REFRESHTOKEN В МИДЛВАРУ
//
//     const oldRefreshToken = req.cookies.refreshToken;
//
//     const newTokens = await authService.refreshJWTandRefreshToken(oldRefreshToken);
//
//     if (!newTokens) {
//         res.sendStatus(401);
//         return;
//     }
//     res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true, secure: true });
//     res
//         .status(200)
//         .json({
//             accessToken: newTokens.jwtToken,
//         });
//
// }