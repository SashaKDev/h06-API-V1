import {BlogViewModel} from "./blogsViewModel";

export type BlogsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}