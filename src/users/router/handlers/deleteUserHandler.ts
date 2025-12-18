import {Request, Response} from "express";
import {usersService} from "../../application/usersService";

export const deleteUserHandler = async (req: Request, res: Response) => {

    const deleteResult = await usersService.deleteById(req.params.id);
    if (deleteResult === 0) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}