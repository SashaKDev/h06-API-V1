import {BlogViewModel} from "../types/blogsViewModel.js";
import {BlogDocument} from "../model/blogModel.js";

export const mapBlogToViewModel = (blog: BlogDocument): BlogViewModel => {
    return{
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,

    }
}