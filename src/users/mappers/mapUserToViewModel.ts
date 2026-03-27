import {User} from "../types/user.js";
import {UserViewModel} from "../types/userViewModel.js";
import {WithId} from "mongodb";

export const mapUserToViewModel = (user: WithId<User>): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}