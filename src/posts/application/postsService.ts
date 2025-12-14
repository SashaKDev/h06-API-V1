import {Post} from "../types/post";
import {postsRepository} from "../repositories/postsRepository";
import {PostInputDto} from "../dto/post-input.dto";
import {blogsService} from "../../blogs/application/blogsService";

export const postsService = {

    async create(post: PostInputDto): Promise<string | null> {
        const foundBlog = await blogsService.findById(post.blogId);
        if (!foundBlog) {
            return null;
        }

        const newPost: Post = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt: new Date().toISOString(),
            blogName: foundBlog.name
        }

        return await postsRepository.create(newPost);

    },

    async createForBlog(post: PostInputDto): Promise<string | null> {
        const foundBlog = await blogsService.findById(post.blogId);
        if (!foundBlog) {
            return null;
        }
        const newPost: Post = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.create(newPost);
    },

    async update(id: string, dto: PostInputDto): Promise<number> {
        return await postsRepository.update(id, dto);
    },

    async delete(id: string): Promise<number> {
        return await postsRepository.delete(id);
    }

}