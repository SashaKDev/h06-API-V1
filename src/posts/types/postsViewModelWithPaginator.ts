import {PostViewModel} from "./postViewModel.js";

export type PostsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}