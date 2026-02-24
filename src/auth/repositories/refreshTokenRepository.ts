import {refreshTokenBlackListCollection} from "../../db/mongo.db";
import {WithId} from "mongodb";
import {RefreshTokenType} from "../types/refreshTokenType";

export const refreshTokenRepository = {

    async findRefreshToken(oldRefreshToken: string): Promise<WithId<RefreshTokenType> | null> {

        const findResult = await refreshTokenBlackListCollection.findOne({refreshToken: oldRefreshToken});
        if (!findResult) {
            return null;
        }
        return findResult;

    },

    async addTokenToBlackList(token: string): Promise<void> {

        await refreshTokenBlackListCollection.insertOne({refreshToken: token});

    }

}
