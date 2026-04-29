import {PostViewModel} from "../types/postViewModel.js";
import {PostDocument} from "../types/postDocument.js";


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