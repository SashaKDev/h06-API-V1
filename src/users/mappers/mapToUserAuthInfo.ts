import {WithId} from "mongodb";
import {User} from "../types/user.js";
import {UserAuthInfo} from "../types/userAuthInfo.js";
import {UserDocument} from "../types/userDocument.js";

export const mapToUserAuthInfo = (user: UserDocument): UserAuthInfo => {
    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email,
    }
}