import {BlogsRepository} from "../repositories/blogsRepository.js";
import {Blog} from "../types/blog.js";
import {BlogInputDto} from "../dto/blog-input.dto.js";
import {inject, injectable} from "inversify";
import {BlogModel} from "../model/blogModel.js";

@injectable()
export class BlogsService {

    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }

    async findById(id: string): Promise<Blog | null> {
        return await this.blogsRepository.findById(id);
    }

    async create(blog: BlogInputDto): Promise<string> {
        // const newBlog = {
        //     name: blog.name,
        //     description: blog.description,
        //     websiteUrl: blog.websiteUrl,
        //     createdAt: new Date().toISOString(),
        //     isMembership: false
        // };

        const newBlog = BlogModel.createBlog(blog)
        await this.blogsRepository.save(newBlog);
        return newBlog._id.toString();
    }

    async update(id: string, blog: BlogInputDto): Promise<boolean> {
        return await this.blogsRepository.update(id, blog);
    }

    async delete(id: string): Promise<boolean> {
        return await this.blogsRepository.delete(id);
    }
}