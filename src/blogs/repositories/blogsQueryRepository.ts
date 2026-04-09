import {blogsCollection} from "../../db/mongo.db.js";
import {mapBlogsViewModelToBlogsWithPaginator} from "../mapers/mapToBlogsWithPaginator.js";
import {BlogsViewModelWithPaginator} from "../types/BlogsViewModelWithPaginator.js";
import {ObjectId, WithId} from "mongodb";
import {BlogViewModel} from "../types/blogsViewModel.js";
import {mapBlogToViewModel} from "../mapers/mapBlogToViewModel.js";
import {injectable} from "inversify";
import {BlogModel} from "../model/blogModel.js";
import {Blog} from "../types/blog.js";
import {BlogDocument} from "../types/blogDocument.js";
import {isBooleanObject} from "node:util/types";

@injectable()
export class BlogsQueryRepository {
    async findAll(pageNumber: number, pageSize: number, sortBy: string, sortDirection: string, searchNameTerm: string): Promise<BlogsViewModelWithPaginator>{

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sortDirectionNumber = sortDirection === 'desc' ? -1 : 1;

        let filter = {};
        if (searchNameTerm) {
            filter = { name: { $regex: searchNameTerm, $options: "i" } }
        }

        const blogs = await BlogModel
                .find(filter)
                .sort({ [sortBy]:  sortDirectionNumber})
                .skip(skip)
                .limit(limit)

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
    }

    async findById(id: string): Promise<BlogViewModel | null>{
        const foundBlog =  await BlogModel.findById(id);
        console.log(foundBlog);
        if (!foundBlog) {
            return null;
        }
        return mapBlogToViewModel(foundBlog);
        // return foundBlog;
    }
}