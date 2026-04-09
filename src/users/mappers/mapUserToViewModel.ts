import {UserViewModel} from "../types/userViewModel.js";
import {UserDocument} from "../types/userDocument.js";

export const mapUserToViewModel = (user: UserDocument): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}