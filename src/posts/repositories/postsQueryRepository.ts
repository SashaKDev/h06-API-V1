import {mapPostToViewModel} from "../mapers/mapPostToViewModel.js";
import {mapToPostsWithPaginator} from "../mapers/mapToPostsWithPaginator.js";
import {PostsViewModelWithPaginator} from "../types/postsViewModelWithPaginator.js";
import {PostViewModel} from "../types/postViewModel.js";
import {injectable} from "inversify";
import {PostModel} from "../model/postsModel.js";

@injectable()
export class PostsQueryRepository {

    async findAll(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string): Promise<PostsViewModelWithPaginator>{
        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = (sortDirection === 'desc') ? -1 : 1;

        const posts = await PostModel
                .find()
                .sort({[sortBy]: sortDirectionNumber})
                .skip(skip)
                .limit(limit)

        const totalCount = await PostModel.countDocuments()

        const postsViewModel = posts.map(mapPostToViewModel);

        return mapToPostsWithPaginator(postsViewModel, totalCount, pageSize, pageNumber);
    }

    async findById(id: string): Promise<PostViewModel | null>{
        const post = await PostModel.findById(id);

        if (!post) {
            return null;
        }
        return mapPostToViewModel(post)
    }

    async findAllForBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<PostsViewModelWithPaginator>{

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = (sortDirection === 'desc') ? -1 : 1;

        const posts = await PostModel
                    .find({blogId: id})
                    .sort({[sortBy]: sortDirectionNumber})
                    .skip(skip)
                    .limit(limit)

        const totalCount = await PostModel.countDocuments({blogId: id})
        const postsViewModel = posts.map(mapPostToViewModel);
        return mapToPostsWithPaginator(postsViewModel, totalCount, pageSize, pageNumber);
    }

}