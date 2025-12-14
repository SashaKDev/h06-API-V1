import {Post} from "../types/post";
import {PostInputDto} from "../dto/post-input.dto";
import {ObjectId, WithId} from "mongodb";
import {postsCollection} from "../../db/mongo.db";

export const postsRepository = {

    async findById(id: string): Promise<WithId<Post> | null> {
        return await postsRepository.findById(id);
    },

    async create(post: Post): Promise<string> {
        const insertedPost = await postsCollection.insertOne(post);
        return insertedPost.insertedId.toString();
    },

    async update(id: string, dto: PostInputDto): Promise<number> {
        const updateResult = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId
            }});
        return updateResult.matchedCount
    },

    async delete(id: string): Promise<number> {
        const deleteResult = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount;
    }
};