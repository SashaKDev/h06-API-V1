import jwt from "jsonwebtoken"
import {SETTINGS} from "../core/settings/settings.js";

export class jwtService {

    static async createJWT (id: string): Promise<string> {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});
        return token;
    }

    static async createRecoveryCode (id: string): Promise<string> {
        const token = jwt.sign({userId: id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'});
        return token;
    }

    static async createRefreshToken (userId: string, deviceId: string): Promise<string> {
        const refreshToken = jwt.sign({userId: userId, deviceId: deviceId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: '10h'});
        return refreshToken;
    }

    static async verifyJWT (token: string): Promise<string | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
            return payload.userId;
        } catch (e) {
            return null;
        }

    }

    static async verifyRefreshToken (token: string): Promise<{ userId: string, deviceId: string } | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET) as { userId: string, deviceId: string };
            return {userId: payload.userId, deviceId: payload.deviceId};
        } catch (e) {
            return null;
        }
    }
}