import {Router} from "express";
import {getDevicesForUserHandler} from "./handlers/getDevicesForUserHandler.js";
import {refreshTokenVerifyMiddleware} from "../../auth/middlewares/refreshTokenVerifyMiddleware.js";
import {deleteAllOtherSessionsHandler} from "./handlers/deleteAllOtherSessionsHandler.js";
import {deleteSessionByDeviceIdHandler} from "./handlers/deleteSessionByDeviceIdHandler.js";

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