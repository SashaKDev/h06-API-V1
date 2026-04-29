import {injectable} from "inversify";
import {PostDocument} from "../types/postDocument.js";

import {PostLikeDocument, PostsLikesModel} from "./postsLikesModel.js";

@injectable()
export class PostsLikesRepository {

    async findLike(userId: string, postId: string): Promise<PostLikeDocument | null> {
        return PostsLikesModel.findOne({userId: userId, postId: postId});
    }

    async findNewestLikesForPost(postId: string, likesAmount: number): Promise<PostLikeDocument[]> {
        return PostsLikesModel
            .find({postId: postId, status: "Like"})
            .sort({ createdAt: -1 })
            .limit(likesAmount)

    }

    async createLike(userId: string, postId: string, likeStatus: string): Promise<boolean> {
        const newLike = new PostsLikesModel({userId, postId, status: likeStatus});
        await newLike.save();
        return true
    }

    // async calculateLikesForPost(postId: string): Promise<number> {
    //     return PostsLikesModel.countDocuments({postId: postId, status: "Like"});
    // }
    // async calculateDislikesForPost(postId: string): Promise<number> {
    //     return PostsLikesModel.countDocuments({postId: postId, status: "Dislike"});
    // }

    async save(like: PostLikeDocument): Promise<boolean> {
        await like.save()
        return true
    }

}