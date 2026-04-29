import {Post} from "../types/post.js";
import {PostInputDto} from "../dto/post-input.dto.js";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {PostModel} from "../model/postsModel.js";
import {PostDocument} from "../types/postDocument.js";

@injectable()
export class PostsRepository {

    async findById(id: string): Promise<PostDocument | null> {
        return await PostModel.findById(id);
    }

    async create(post: Post): Promise<string> {
        const newPost = new PostModel(post);
        await newPost.save();
        return newPost.id;
    }

    async update(id: string, dto: PostInputDto): Promise<number> {
        const foundPost = await PostModel.findById(id);
        if (!foundPost) {
            return 0
        }

        foundPost.title = dto.title;
        foundPost.shortDescription = dto.shortDescription;
        foundPost.content = dto.content;
        foundPost.blogId = dto.blogId;
        foundPost.save();
        return 1
    }

    async delete(id: string): Promise<number> {
        const deleteResult = await PostModel.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount;
    }

    async save(post: PostDocument): Promise<boolean> {
        post.save();
        return true;
    }
}