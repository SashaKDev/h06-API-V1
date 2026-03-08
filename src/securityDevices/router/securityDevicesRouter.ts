import {Router} from "express";
import {getDevicesForUserHandler} from "./handlers/getDevicesForUserHandler";
import {refreshTokenVerifyMiddleware} from "../../auth/middlewares/refreshTokenVerifyMiddleware";
import {deleteAllOtherSessionsHandler} from "./handlers/deleteAllOtherSessionsHandler";
import {deleteSessionByDeviceIdHandler} from "./handlers/deleteSessionByDeviceIdHandler";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/",
    refreshTokenVerifyMiddleware,
    getDevicesForUserHandler
);

securityDevicesRouter.delete("/",
    refreshTokenVerifyMiddleware,
    deleteAllOtherSessionsHandler
);

securityDevicesRouter.delete("/:id",
    refreshTokenVerifyMiddleware,
    deleteSessionByDeviceIdHandler
)