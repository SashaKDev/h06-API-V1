import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";

export const registrationEmailResendingHandler = async (req: Request, res: Response) => {

    const email = req.body.email;

    try {
        await authService.resendConfirmationCode(email);
    } catch (error: any)  {
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