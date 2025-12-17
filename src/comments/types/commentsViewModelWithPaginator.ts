import {CommentsViewModel} from "./commentsViewModel";

export type CommentsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentsViewModel[]
}