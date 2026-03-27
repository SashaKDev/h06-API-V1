import {Post} from "../types/post.js";
import {PostsRepository} from "../repositories/postsRepository.js";
import {PostInputDto} from "../dto/post-input.dto.js";
import {BlogsService} from "../../blogs/application/blogsService.js";
import {WithId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {

    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsService) protected blogsService: BlogsService) {}

    async findById(id: string): Promise<WithId<Post> | null> {
        return await this.postsRepository.findById(id)
    }

    async create(post: PostInputDto): Promise<string | null> {
        const foundBlog = await this.blogsService.findById(post.blogId);
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

        return await this.postsRepository.create(newPost);

    }

    async createForBlog(post: PostInputDto): Promise<string | null> {
        const foundBlog = await this.blogsService.findById(post.blogId);
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
        return await this.postsRepository.create(newPost);
    }

    async update(id: string, dto: PostInputDto): Promise<number> {
        return await this.postsRepository.update(id, dto);
    }

    async delete(id: string): Promise<number> {
        return await this.postsRepository.delete(id);
    }

}