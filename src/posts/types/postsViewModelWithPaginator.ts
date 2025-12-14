import {PostViewModel} from "./postViewModel";

export type PostsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}