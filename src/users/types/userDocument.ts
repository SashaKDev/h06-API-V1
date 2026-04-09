import {HydratedDocument} from "mongoose"
import {User} from "./user.js";

export type UserDocument = HydratedDocument<User>