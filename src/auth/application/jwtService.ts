import jwt from "jsonwebtoken"
import {SETTINGS} from "../../core/settings/settings";

export const jwtService = {

    async createJWT (id: string): Promise<string> {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});
        return token;
    },

    async verifyJWT (token: string): Promise<string | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
            return payload.userId;
        } catch (e) {
            return null;
        }

    }
}