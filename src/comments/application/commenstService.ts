import {CommentInputModel} from "../types/commentInputModel";
import {postsRepository} from "../../posts/repositories/postsRepository";
import {commentsRepository} from "../repositories/commentsRepository";
import {CommentType} from "../types/commentType";
import {postsService} from "../../posts/application/postsService";
import {CommentsPaginationData} from "../types/commentsPaginationData";
import {commentsQueryRepository} from "../repositories/commentsQueryRepository";
import {WithId} from "mongodb";
import {usersService} from "../../users/application/usersService";
import {usersRepository} from "../../users/repository/usersRepository";

export const commentsService = {
    async createCommentForPost(postId: string, comment: string, userId: string): Promise<string | null> {
        const post = await postsRepository.findById(postId);
        // console.log(post)
        if (!post) {
            return null;
        }
        const user = await usersRepository.findById(userId);
        console.log(user)
        if (!user) {
            return null;
        }
        const commentDto: CommentType = {
            postId: postId,
            content: comment,
            createdAt: new Date().toISOString(),
            userId: userId,
            userLogin: user.login,
        }
        return await commentsRepository.createCommentForPost(commentDto);
    },

    async findById(id: string): Promise<WithId<CommentType> | null> {
        return await commentsRepository.findById(id);
    },

    async updateComment(commentId: string, content: string): Promise<number> {
        return commentsRepository.updateComment(commentId, content);
    },

    async delete(commentId: string, userId: string): Promise<number> {
        const foundComment = await commentsRepository.findById(commentId);
        if (!foundComment) {
            return 0;
        }
        if (foundComment.userId !== userId) {
            throw new Error('Incorrect user')
        }
        return await commentsRepository.delete(commentId);
    }



}