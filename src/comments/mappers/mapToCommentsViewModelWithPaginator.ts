import {CommentsViewModelWithPaginator} from "../types/commentsViewModelWithPaginator.js";
import {CommentsViewModel} from "../types/commentsViewModel.js";

export const mapToCommentsViewModelWithPaginator = (foundCommentsViewModel: CommentsViewModel[], totalCount: number,
                                                 pageSize: number, pageNumber:number): CommentsViewModelWithPaginator => {

    return {
        totalCount: totalCount,
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        items: foundCommentsViewModel
    }

}