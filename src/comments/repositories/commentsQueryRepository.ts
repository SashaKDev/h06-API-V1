import {commentsCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";
import {CommentsViewModel} from "../types/commentsViewModel";
import {mapCommentToViewModel} from "../mappers/mapCommentToViewModel";
import {CommentsPaginationData} from "../types/commentsPaginationData";
import {CommentsViewModelWithPaginator} from "../types/commentsViewModelWithPaginator";
import {mapToCommentsViewModelWithPaginator} from "../mappers/mapToCommentsViewModelWithPaginator";

export const commentsQueryRepository = {

    async findById(id: string): Promise<CommentsViewModel | null> {
        const foundComment = await commentsCollection.findOne({_id: new ObjectId(id)});
        if (!foundComment) {
            return null;
        }
        return mapCommentToViewModel(foundComment);
    },

    async findCommentsForPost(postId: string, data: CommentsPaginationData): Promise<CommentsViewModelWithPaginator | null> {

        const skip = (data.pageNumber - 1) * data.pageSize;
        const limit = data.pageSize;
        const sortBy = data.sortBy;
        const sortDirectionNumber = data.sortDirection === 'desc' ? -1 : 1;

        const foundComments = await commentsCollection
            .find({postId: postId})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await commentsCollection.countDocuments({postId: postId})

        const foundCommentsViewModel = foundComments.map(mapCommentToViewModel);
        return mapToCommentsViewModelWithPaginator(foundCommentsViewModel, totalCount, data.pageSize, data.pageNumber);
    }

}