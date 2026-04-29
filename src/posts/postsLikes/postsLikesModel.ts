// import mongoose from "mongoose";
//
export enum LikeStatuses {
    Like = "Like",
    Dislike = "Dislike",
    None = "None",
}
//
// const PostLikesSchema = new mongoose.Schema({
//     createdAt: { type: Date, default: Date.now, required: true },
//     userId: { type: String, required: true },
//     postId: { type: String, required: true },
//     status: { type: String, enum: Object.values(LikeStatuses), required: true },
// })
//
// export const PostsLikesModel = mongoose.model("postsLikes", PostLikesSchema)

import {HydratedDocument, Model, model} from "mongoose"
import mongoose from "mongoose"
import {PostLikeType} from "./types/postLikeType.js";


interface PostsLikesMethods {
    // listMainInfo(): void

}

type PostsLikesStatics = typeof PostsLikesEntity;

type PostsLikesModel = Model<PostLikeType, {}, PostsLikesMethods> & PostsLikesStatics;

export type PostLikeDocument = HydratedDocument<PostLikeType, PostsLikesMethods>;

const postsLikeSchema = new mongoose.Schema<PostLikeType, PostsLikesModel, PostsLikesMethods>(
    {
        createdAt: {type: Date, default: Date.now, required: true},
        userId: {type: String, required: true},
        postId: {type: String, required: true},
        status: {type: String, enum: Object.values(LikeStatuses), required: true},
    }
);

class PostsLikesEntity {
    private constructor(
        public createdAt: Date,
        public userId: string,
        public postId: string,
        public status: string,
    ) {
    }

    static createLike(userId: string, postId: string, status: string) {
        const newLike = new PostsLikesModel({userId, postId, status});
        return newLike;
    }

    static async calculateLikesForPost(postId: string): Promise<number> {
        return await PostsLikesModel.countDocuments({postId: postId, status: "Like"});
    }

    static async calculateDislikesForPost(postId: string): Promise<number> {
        return await PostsLikesModel.countDocuments({postId: postId, status: "Dislike"});
    }

}

postsLikeSchema.loadClass(PostsLikesEntity);

export const PostsLikesModel = model<PostLikeType, PostsLikesModel>("postsLikes", postsLikeSchema);