import {WithId} from "mongodb";
import {User} from "../types/user";
import {UserAuthInfo} from "../types/userAuthInfo";

export const mapToUserAuthInfo = (user: WithId<User>): UserAuthInfo => {
    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email,
    }
}