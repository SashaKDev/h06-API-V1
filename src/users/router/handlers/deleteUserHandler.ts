import {Request, Response} from "express";
import {usersService} from "../../application/usersService";

export const deleteUserHandler = async (req: Request, res: Response) => {

    const deleteResult = await usersService.deleteById(req.params.id);
    if (!deleteResult) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}