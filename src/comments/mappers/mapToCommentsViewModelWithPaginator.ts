import {CommentsViewModel} from "../types/commentsViewModel";
import {CommentsViewModelWithPaginator} from "../types/commentsViewModelWithPaginator";

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