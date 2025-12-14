import {BlogViewModel} from "../types/blogsViewModel";
import {BlogsViewModelWithPaginator} from "../types/BlogsViewModelWithPaginator";


export const mapBlogsViewModelToBlogsWithPaginator = (blogs: BlogViewModel[], totalCount: number, pageNumber: number, pageSize: number): BlogsViewModelWithPaginator => {
    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: blogs
    }
}