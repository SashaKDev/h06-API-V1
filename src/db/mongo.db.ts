import {Collection, Db, MongoClient} from 'mongodb';
import {Blog} from "../blogs/types/blog";
import {Post} from "../posts/types/post";
import {SETTINGS} from "../core/settings/settings";
import {User} from "../users/types/user";
import {CommentType} from "../comments/types/commentType";

export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;
export let usersCollection: Collection<User>;
export let commentsCollection: Collection<CommentType>;

export const runDb = async (dbUrl: string): Promise<MongoClient> => {

    const client = new MongoClient(dbUrl);
    const db: Db = client.db(SETTINGS.DB);
    blogsCollection = db.collection('blogs');
    postsCollection = db.collection('posts');
    usersCollection = db.collection('users');
    commentsCollection = db.collection('comments');

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("✅ Connected to MongoDB");
        return client;
    } catch (err) {
        await client.close();
        throw new Error("❌ Error connecting to MongoDB");
    }


}