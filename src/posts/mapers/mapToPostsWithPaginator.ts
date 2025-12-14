import {PostsViewModelWithPaginator} from "../types/postsViewModelWithPaginator";
import {PostViewModel} from "../types/postViewModel";

export const mapToPostsWithPaginator = (posts: PostViewModel[], totalCount: number, pageSize: number, pageNumber: number): PostsViewModelWithPaginator => {
    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: posts
    }
}