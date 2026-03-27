// import {Request, Response} from "express";
// import {usersQueryRepository} from "../../../composition-root";
//
// export const getUserInfoHandler = async (req: Request, res: Response) => {
//     const userAuthInfo = await usersQueryRepository.findUserAuthInfo(req.userId!);
//     if (!userAuthInfo) {
//         res.sendStatus(404);
//         return;
//     }
//     res
//         .status(200)
//         .json(userAuthInfo);
// }