import {WithId} from "mongodb";
import {User} from "../types/user.js";
import {UserAuthInfo} from "../types/userAuthInfo.js";

export const mapToUserAuthInfo = (user: WithId<User>): UserAuthInfo => {
    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email,
    }
}