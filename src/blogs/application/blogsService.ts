import {blogsRepository} from "../repositories/blogsRepository";
import {Blog} from "../types/blog";
import {WithId} from "mongodb";
import {BlogInputDto} from "../dto/blog-input.dto";

export const blogsService = {

    async findById(id: string): Promise<WithId<Blog> | null> {
        return await blogsRepository.findById(id);
    },

    async create(blog: BlogInputDto): Promise<string> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return await blogsRepository.create(newBlog);
    },

    async update(id: string, blog: BlogInputDto): Promise<number> {
        return await blogsRepository.update(id, blog);
    },

    async delete(id: string): Promise<number> {
        return await blogsRepository.delete(id);
    }
}