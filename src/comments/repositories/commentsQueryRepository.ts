import {CommentsViewModel} from "../types/commentsViewModel.js";
import {mapCommentToViewModel} from "../mappers/mapCommentToViewModel.js";
import {CommentsPaginationData} from "../types/commentsPaginationData.js";
import {CommentsViewModelWithPaginator} from "../types/commentsViewModelWithPaginator.js";
import {mapToCommentsViewModelWithPaginator} from "../mappers/mapToCommentsViewModelWithPaginator.js";
import {injectable} from "inversify";
import {CommentModel} from "../model/commentModel.js";

@injectable()
export class CommentsQueryRepository {

    async findById(commentId: string): Promise<CommentsViewModel | null> {
        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) {
            return null;
        }
        return mapCommentToViewModel(foundComment);
    }

    async findCommentsForPost(postId: string, data: CommentsPaginationData): Promise<CommentsViewModelWithPaginator> {

        const skip = (data.pageNumber - 1) * data.pageSize;
        const limit = data.pageSize;
        const sortBy = data.sortBy;
        const sortDirectionNumber = data.sortDirection === 'desc' ? -1 : 1;

        const foundComments = await CommentModel
            .find({postId: postId})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skip)
            .limit(limit)

        const totalCount = await CommentModel.countDocuments({postId: postId})

        const foundCommentsViewModel = foundComments.map(mapCommentToViewModel);
        return mapToCommentsViewModelWithPaginator(foundCommentsViewModel, totalCount, data.pageSize, data.pageNumber);
    }

}