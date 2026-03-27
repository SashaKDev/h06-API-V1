import {CommentsViewModel} from "./commentsViewModel.js";

export type CommentsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentsViewModel[]
}