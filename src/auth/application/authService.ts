import {usersRepository} from "../../users/repository/usersRepository";
import bcrypt from "bcrypt";

export const authService = {

    async checkCredentials (loginOrEmail: string, password: string): Promise<boolean> {
        const foundUser = (await usersRepository.findByLoginOrEmail(loginOrEmail))[0];
        if (!foundUser) {
            return false;
        }
        return bcrypt.compare(password, foundUser.password);
    }

}
