import {Collection, Db, MongoClient} from 'mongodb';
import {Blog} from "../blogs/types/blog.js";
import {Post} from "../posts/types/post.js";
import {SETTINGS} from "../core/settings/settings.js";
import {User} from "../users/types/user.js";
import {CommentType} from "../comments/types/commentType.js";
import {RefreshTokenType} from "../auth/types/refreshTokenType.js";
import {SessionType} from "../auth/types/sessionType.js";
import {RateLimitType} from "../auth/types/rateLimitType.js";
import mongoose from "mongoose";

export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;
export let usersCollection: Collection<User>;
export let commentsCollection: Collection<CommentType>;
export let refreshTokenBlackListCollection: Collection<RefreshTokenType>
export let sessionsCollection: Collection<SessionType>;
export let rateLimitCollection: Collection<RateLimitType>

export const runDb = async (dbUrl: string): Promise<MongoClient> => {

    const client = new MongoClient(dbUrl);
    // const db: Db = client.db(SETTINGS.DB);
    const db: Db = client.db(SETTINGS.TEST_DB);
    blogsCollection = db.collection('blogs');
    postsCollection = db.collection('posts');
    usersCollection = db.collection('users');
    commentsCollection = db.collection('comments');
    refreshTokenBlackListCollection = db.collection('refreshTokenBlackList');
    sessionsCollection = db.collection('sessions');
    rateLimitCollection = db.collection('rateLimits');

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("✅ MongoDB driver connected");
        await refreshTokenBlackListCollection.createIndex(
            {createdAt: 1},
            {expireAfterSeconds: 3600},
        )

        await mongoose.connect(dbUrl);
        console.log("✅ Mongoose connected")

        return client;
    } catch (err) {
        await client.close();
        mongoose.disconnect();
        throw new Error("❌ Error connecting to MongoDB");
        // console.log(err)
    }

}