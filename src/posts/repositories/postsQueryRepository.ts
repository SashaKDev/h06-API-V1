import {postsCollection} from "../../db/mongo.db";
import {mapPostToViewModel} from "../mapers/mapPostToViewModel";
import {mapToPostsWithPaginator} from "../mapers/mapToPostsWithPaginator";
import {PostsViewModelWithPaginator} from "../types/postsViewModelWithPaginator";
import {ObjectId} from "mongodb";
import {PostViewModel} from "../types/postViewModel";

export const postsQueryRepository = {

    async findAll(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string): Promise<PostsViewModelWithPaginator>{
        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = (sortDirection === 'desc') ? -1 : 1;
        const posts = await postsCollection
                .find()
                .sort({[sortBy]: sortDirectionNumber})
                .skip(skip)
                .limit(limit)
                .toArray();

        const totalCount = await postsCollection.countDocuments()

        const postsViewModel = posts.map(mapPostToViewModel);

        return mapToPostsWithPaginator(postsViewModel, totalCount, pageSize, pageNumber);
    },

    async findById(id: string): Promise<PostViewModel | null>{
        const post = await postsCollection.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null;
        }
        return mapPostToViewModel(post)
    },

    async findAllForBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string): Promise<PostsViewModelWithPaginator>{

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = (sortDirection === 'desc') ? -1 : 1;

        const posts = await postsCollection
                    .find({blogId: id})
                    .sort({[sortBy]: sortDirectionNumber})
                    .skip(skip)
                    .limit(limit)
                    .toArray();

        const totalCount = await postsCollection.countDocuments({blogId: id})
        const postsViewModel = posts.map(mapPostToViewModel);
        return mapToPostsWithPaginator(postsViewModel, totalCount, pageSize, pageNumber);
    },

}