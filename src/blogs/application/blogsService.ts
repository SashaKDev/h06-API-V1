import {BlogsRepository} from "../repositories/blogsRepository.js";
import {Blog} from "../types/blog.js";
import {WithId} from "mongodb";
import {BlogInputDto} from "../dto/blog-input.dto.js";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {

    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {}

    async findById(id: string): Promise<WithId<Blog> | null> {
        return await this.blogsRepository.findById(id);
    }

    async create(blog: BlogInputDto): Promise<string> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return await this.blogsRepository.create(newBlog);
    }

    async update(id: string, blog: BlogInputDto): Promise<number> {
        return await this.blogsRepository.update(id, blog);
    }

    async delete(id: string): Promise<number> {
        return await this.blogsRepository.delete(id);
    }
}