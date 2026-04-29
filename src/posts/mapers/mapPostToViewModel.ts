import {Post} from "../types/post.js";
import {WithId} from "mongodb";
import {PostViewModel} from "../types/postViewModel.js";
import {PostDocument} from "../types/postDocument.js";
import now = jest.now;


export const mapPostToViewModel = (post: PostDocument): PostViewModel => {
    return{
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.likesCount.likesCount,
            dislikesCount: post.likesCount.dislikesCount,
            myStatus: "None",
            newestLikes: []
        }
    }
}