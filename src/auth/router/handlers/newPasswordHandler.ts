// import {Request, Response} from 'express'
// import {authService} from "../../../adapters/authService";
//
// export const newPasswordHandler = async (req: Request, res: Response) => {
//
//     const newPassword = req.body.newPassword
//     const recoveryCode = req.body.recoveryCode;
//     const updateResult = await authService.updatePassword(recoveryCode, newPassword);
//     if (updateResult === null) {
//         res
//             .status(400)
//             .json({ errorsMessages: [{ message: "invalid recovery code", field: "recoveryCode" }] })
//         return;
//     }
//     res.sendStatus(204);
//
// }