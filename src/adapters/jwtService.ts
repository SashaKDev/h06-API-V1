import jwt from "jsonwebtoken"
import {SETTINGS} from "../core/settings/settings";

export const jwtService = {

    async createJWT (id: string): Promise<string> {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '10s'});
        return token;
    },

    async createRefreshToken (id: string): Promise<string> {
        const refreshToken = jwt.sign({userId: id}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: '20s'});
        return refreshToken;
    },

    async verifyJWT (token: string): Promise<string | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
            console.log(payload);
            return payload.userId;
        } catch (e) {
            return null;
        }

    },

    async verifyRefreshToken (token: string): Promise<string | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET) as { userId: string };
            console.log(payload);
            return payload.userId;
        } catch (e) {
            return null;
        }
    }
}