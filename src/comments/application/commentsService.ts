import {PostsRepository} from "../../posts/repositories/postsRepository.js";
import {CommentsRepository} from "../repositories/commentsRepository.js";
import {CommentType} from "../types/commentType.js";
import {WithId} from "mongodb";
import {UsersRepository} from "../../users/repository/usersRepository.js";
import {inject, injectable} from "inversify";
import {CommentDocument} from "../types/commentDocument.js";
import {commentsRouter} from "../router/commentsRouter.js";

@injectable()
export class CommentsService {

    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository,) {}

    async createCommentForPost(postId: string, comment: string, userId: string): Promise<string | null> {
        const post = await this.postsRepository.findById(postId);
        // console.log(post)
        if (!post) {
            return null;
        }
        const user = await this.usersRepository.findById(userId);
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
            likesInfo: {
                likes: 0,
                dislikes: 0,
            }
        }
        return await this.commentsRepository.createCommentForPost(commentDto);
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return await this.commentsRepository.findById(id);
    }

    async updateComment(commentId: string, content: string): Promise<number> {
        return this.commentsRepository.updateComment(commentId, content);
    }

    async delete(commentId: string, userId: string): Promise<number> {
        const foundComment = await this.commentsRepository.findById(commentId);
        if (!foundComment) {
            return 0;
        }
        if (foundComment.userId !== userId) {
            throw new Error('Incorrect user')
        }
        return await this.commentsRepository.delete(commentId);
    }

    async changeLikeStatus(commentId: string, likeStatus: string, userId: string): Promise<number> {


        const foundComment = await this.commentsRepository.findById(commentId);
        if (!foundComment) {
            return 0
        }
        const foundUser = await this.usersRepository.findById(userId);
        if (!foundUser) {
            return 0;
        }
        if(likeStatus === "Like"){
            if (foundUser.likesInfo.likes.includes(commentId)) {
                return 1
            }
            if (foundUser.likesInfo.dislikes.includes(commentId)) {
                await this.commentsRepository.changeDislikeOnLike(commentId)
                await this.usersRepository.changeUserLikeStatusFromDislikeOnLike(userId, commentId);
                return 1
            }
        }

        if(likeStatus === "Dislike"){
            if (foundUser.likesInfo.dislikes.includes(commentId)) {
                return 1
            }
            if (foundUser.likesInfo.likes.includes(commentId)) {
                await this.commentsRepository.changeLikeOnDislike(commentId)
                await this.usersRepository.changeUserLikeStatusFromLikeOnDislike(userId, commentId);
                return 1
            }
        }

        if (likeStatus === "None"){
            if (foundUser.likesInfo.likes.includes(commentId)) {
                await this.commentsRepository.decreaseLike(commentId);
                await this.usersRepository.deleteUserLike(userId, commentId);
                return 1
            }
            if (foundUser.likesInfo.dislikes.includes(commentId)) {
                await this.commentsRepository.decreaseDislike(commentId);
                await this.usersRepository.deleteUserDislike(userId, commentId);
                return 1
            }
            else {
                return 1;
            }

        }
        await this.usersRepository.changeUserLikesInfo(commentId, likeStatus, userId);
        return await this.commentsRepository.changeLikeStatus(commentId, likeStatus);

    }

}
