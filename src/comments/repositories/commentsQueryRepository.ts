import {commentsCollection} from "../../db/mongo.db.js";
import {ObjectId} from "mongodb";
import {CommentsViewModel} from "../types/commentsViewModel.js";
import {mapCommentToViewModel} from "../mappers/mapCommentToViewModel.js";
import {CommentsPaginationData} from "../types/commentsPaginationData.js";
import {CommentsViewModelWithPaginator} from "../types/commentsViewModelWithPaginator.js";
import {mapToCommentsViewModelWithPaginator} from "../mappers/mapToCommentsViewModelWithPaginator.js";
import {injectable} from "inversify";

@injectable()
export class CommentsQueryRepository {

    async findById(commentId: string): Promise<CommentsViewModel | null> {
        const foundComment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
        if (!foundComment) {
            return null;
        }
        return mapCommentToViewModel(foundComment);
    }

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