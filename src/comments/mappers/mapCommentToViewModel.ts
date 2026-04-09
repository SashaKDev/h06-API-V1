import {CommentsViewModel} from "../types/commentsViewModel.js";
import {CommentDocument} from "../types/commentDocument.js";

export const mapCommentToViewModel = (comment: CommentDocument): CommentsViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likes,
            dislikesCount: comment.likesInfo.dislikes,
            myStatus: "None"
        }

    }
}