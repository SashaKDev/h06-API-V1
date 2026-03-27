import {BlogViewModel} from "./blogsViewModel.js";

export type BlogsViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}