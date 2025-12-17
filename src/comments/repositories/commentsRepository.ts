import {commentsCollection} from "../../db/mongo.db";
import {CommentType} from "../types/commentType";
import {ObjectId, WithId} from "mongodb";
import {commentsService} from "../application/commenstService";

export const commentsRepository = {

    async createCommentForPost(dto: CommentType): Promise<string> {
        const insertedComment = await commentsCollection.insertOne(dto);
        return insertedComment.insertedId.toString();
    },

    async findById(id: string): Promise<WithId<CommentType> | null> {
        return await commentsCollection.findOne({_id: new ObjectId(id)})
    },

    async updateComment(commentId: string, content: string): Promise<number> {
        const updateResult = await commentsCollection.updateOne(
            {_id: new ObjectId(commentId)},
            {
                $set: {
                    content: content,

                }}
            );
        return updateResult.matchedCount
    },

    async delete(commentId: string): Promise<number> {
        const deleteResult = await commentsCollection.deleteOne({_id: new ObjectId(commentId)});
        return deleteResult.deletedCount;
    },



}