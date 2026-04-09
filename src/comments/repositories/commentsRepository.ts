import {CommentType} from "../types/commentType.js";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentModel} from "../model/commentModel.js";
import {CommentDocument} from "../types/commentDocument.js";

@injectable()
export class CommentsRepository {

    async createCommentForPost(dto: CommentType): Promise<string> {
        const insertedComment = await CommentModel.insertOne(dto);
        return insertedComment.id;
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return await CommentModel.findById(id)
    }

    async updateComment(commentId: string, content: string): Promise<number> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return 0
        }
        foundComment.content = content;
        await foundComment.save();

        // const updateResult = await commentsCollection.updateOne(
        //     {_id: new ObjectId(commentId)},
        //     {
        //         $set: {
        //             content: content,
        //
        //         }
        //     }
        // );
        return 1
    }

    async delete(commentId: string): Promise<number> {
        const deleteResult = await CommentModel.deleteOne({_id: new ObjectId(commentId)});
        return deleteResult.deletedCount;
    }

    async changeLikeStatus(commentId: string, likeStatus: string): Promise<number> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return 0
        }
        if (likeStatus === 'Like') {
            console.log("like");
            foundComment.likesInfo.likes = foundComment.likesInfo.likes + 1;
        }
        if (likeStatus === 'Dislike') {
            foundComment.likesInfo.dislikes = foundComment.likesInfo.dislikes + 1;
        }
        await foundComment.save();
        return 1
    }

    async changeDislikeOnLike(commentId: string): Promise<boolean> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return false
        }
        foundComment.likesInfo.likes = foundComment.likesInfo.likes + 1;
        foundComment.likesInfo.dislikes = foundComment.likesInfo.dislikes - 1;
        await foundComment.save();
        return true
    }

    async changeLikeOnDislike(commentId: string): Promise<boolean> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return false
        }
        foundComment.likesInfo.likes = foundComment.likesInfo.likes - 1;
        foundComment.likesInfo.dislikes = foundComment.likesInfo.dislikes + 1;
        await foundComment.save();
        return true
    }

    async decreaseLike(commentId: string): Promise<boolean> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return false
        }
        foundComment.likesInfo.likes = foundComment.likesInfo.likes - 1;
        await foundComment.save();
        return true
    }

    async decreaseDislike(commentId: string): Promise<boolean> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return false
        }
        foundComment.likesInfo.dislikes = foundComment.likesInfo.dislikes - 1;
        await foundComment.save();
        return true
    }


}