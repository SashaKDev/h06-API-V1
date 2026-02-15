import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";

export const registrationEmailResendingHandler = async (req: Request, res: Response) => {

    const email = req.body.email;

    const resendResult = await authService.resendConfirmationCode(email);
    console.log(resendResult);
    if (!resendResult) {
        res.status(400)
            .json({
                "errorsMessages": [
                    {
                        "message": "Email already confirmed",
                        "field": "email"
                    }
                ]
            });
        return;
    }
    res.sendStatus(204)

}