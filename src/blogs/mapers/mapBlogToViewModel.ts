import {Blog} from "../types/blog.js";
import {WithId} from "mongodb";
import {BlogViewModel} from "../types/blogsViewModel.js";

export const mapBlogToViewModel = (blog: WithId<Blog>): BlogViewModel => {
    return{
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,

    }
}