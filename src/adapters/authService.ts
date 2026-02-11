import {usersRepository} from "../users/repository/usersRepository";
import bcrypt from "bcrypt";
import {jwtService} from "./jwtService";

export const authService = {

    async loginUser (loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser = (await usersRepository.findByLoginOrEmail(loginOrEmail))[0];
        if (!foundUser) {
            return null;
        }
        const passwordCheckResult = await bcrypt.compare(password, foundUser.password);
        if (!passwordCheckResult) {
            return null;
        }
        return await jwtService.createJWT(foundUser._id.toString());
    }

}
