import {WithId} from "mongodb";
import {CommentType} from "../types/commentType.js";
import {CommentsViewModel} from "../types/commentsViewModel.js";

export const mapCommentToViewModel = (comment: WithId<CommentType>): CommentsViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
    }
}