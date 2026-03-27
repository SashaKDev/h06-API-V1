import {Post} from "../types/post.js";
import {PostInputDto} from "../dto/post-input.dto.js";
import {ObjectId, WithId} from "mongodb";
import {postsCollection} from "../../db/mongo.db.js";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

    async findById(id: string): Promise<WithId<Post> | null> {
        const foundPost = await postsCollection.findOne({_id: new ObjectId(id)});
        // console.log(foundPost);
        return foundPost;
    }

    async create(post: Post): Promise<string> {
        const insertedPost = await postsCollection.insertOne(post);
        return insertedPost.insertedId.toString();
    }

    async update(id: string, dto: PostInputDto): Promise<number> {
        const updateResult = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId
            }});
        return updateResult.matchedCount
    }

    async delete(id: string): Promise<number> {
        const deleteResult = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount;
    }
}