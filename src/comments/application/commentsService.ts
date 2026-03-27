import {PostsRepository} from "../../posts/repositories/postsRepository.js";
import {CommentsRepository} from "../repositories/commentsRepository.js";
import {CommentType} from "../types/commentType.js";
import {WithId} from "mongodb";
import {UsersRepository} from "../../users/repository/usersRepository.js";
import {inject, injectable} from "inversify";

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
        }
        return await this.commentsRepository.createCommentForPost(commentDto);
    }

    async findById(id: string): Promise<WithId<CommentType> | null> {
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

}
