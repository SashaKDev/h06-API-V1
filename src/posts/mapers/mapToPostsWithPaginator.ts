import {PostsViewModelWithPaginator} from "../types/postsViewModelWithPaginator.js";
import {PostViewModel} from "../types/postViewModel.js";

export const mapToPostsWithPaginator = (posts: PostViewModel[], totalCount: number, pageSize: number, pageNumber: number): PostsViewModelWithPaginator => {
    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: posts
    }
}