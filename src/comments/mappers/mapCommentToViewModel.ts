import {WithId} from "mongodb";
import {CommentType} from "../types/commentType";
import {CommentsViewModel} from "../types/commentsViewModel";

export const mapCommentToViewModel = (comment: WithId<CommentType>): CommentsViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        // commentatorInfo
        createdAt: comment.createdAt,
    }
}