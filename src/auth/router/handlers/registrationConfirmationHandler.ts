import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";

export const registrationConfirmationHandler = async (req: Request, res: Response) => {

    const confirmationCode = req.body.code;
    console.log(confirmationCode);

    const codeConfirmationResult = await authService.validateConfirmationCode(confirmationCode);
    if (!codeConfirmationResult) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(204);


}