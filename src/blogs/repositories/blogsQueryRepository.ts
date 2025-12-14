import {blogsCollection} from "../../db/mongo.db";
import {mapBlogsViewModelToBlogsWithPaginator} from "../mapers/mapToBlogsWithPaginator";
import {BlogsViewModelWithPaginator} from "../types/BlogsViewModelWithPaginator";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../types/blogsViewModel";
import {mapBlogToViewModel} from "../mapers/mapBlogToViewModel";


export const blogsQueryRepository = {
    async findAll(pageNumber: number, pageSize: number, sortBy: string, sortDirection: string, searchNameTerm: string): Promise<BlogsViewModelWithPaginator>{

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = sortDirection === 'desc' ? -1 : 1;

        let filter = {};
        if (searchNameTerm) {
            filter = { name: { $regex: searchNameTerm, $options: "i" } }
        }

        const blogs = await blogsCollection
                .find(filter)
                .sort({ [sortBy]:  sortDirectionNumber})
                .skip(skip)
                .limit(limit)
                .toArray();
        const totalCount = await blogsCollection.countDocuments(filter)
        //     WithId<Blog>[] => BlogViewModel[]
        const blogsViewModel = blogs.map(blogs => {
               return {
                   id: blogs._id.toString(),
                   name: blogs.name,
                   description: blogs.description,
                   websiteUrl: blogs.websiteUrl,
                   createdAt: blogs.createdAt,
                   isMembership: blogs.isMembership,
               }
        })
        //     BlogViewModel[] => BlogViewModelWithPaginator
        return mapBlogsViewModelToBlogsWithPaginator(blogsViewModel, totalCount, pageNumber, pageSize);
    },

    async findById(id: string): Promise<BlogViewModel | null>{
        const foundBlog =  await blogsCollection.findOne({_id: new ObjectId(id)});
        if (!foundBlog) {
            return null;
        }
        return mapBlogToViewModel(foundBlog);
    },
}