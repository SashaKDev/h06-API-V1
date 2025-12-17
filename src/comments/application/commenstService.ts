import {CommentInputModel} from "../types/commentInputModel";
import {postsRepository} from "../../posts/repositories/postsRepository";
import {commentsRepository} from "../repositories/commentsRepository";
import {CommentType} from "../types/commentType";
import {postsService} from "../../posts/application/postsService";
import {CommentsPaginationData} from "../types/commentsPaginationData";
import {commentsQueryRepository} from "../repositories/commentsQueryRepository";
import {WithId} from "mongodb";

export const commentsService = {
    async createCommentForPost(postId: string, comment: string): Promise<string | null> {
        const post = await postsRepository.findById(postId);
        if (!post) {
            return null;
        }
        const commentDto: CommentType = {
            postId: postId,
            content: comment,
            createdAt: new Date().toISOString(),
        }
        console.log(comment)
        return await commentsRepository.createCommentForPost(commentDto);
    },

    async findById(id: string): Promise<WithId<CommentType> | null> {
        return await commentsRepository.findById(id);
    },

    async updateComment(commentId: string, content: string): Promise<number> {
        return commentsRepository.updateComment(commentId, content);
    },

    async delete(commentId: string): Promise<number> {
        return await commentsRepository.delete(commentId);
    }



}