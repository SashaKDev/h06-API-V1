import {Post} from "../types/post.js";
import {PostsRepository} from "../repositories/postsRepository.js";
import {PostInputDto} from "../dto/post-input.dto.js";
import {BlogsService} from "../../blogs/application/blogsService.js";
import {inject, injectable} from "inversify";
import {PostDocument} from "../types/postDocument.js";
import {LikeStatuses, PostsLikesModel} from "../postsLikes/postsLikesModel.js";
import {PostsLikesRepository} from "../postsLikes/postsLikesRepository.js";

@injectable()
export class PostsService {

    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsService) protected blogsService: BlogsService,
                @inject(PostsLikesRepository) protected postsLikesRepository: PostsLikesRepository,) {}

    async findById(id: string): Promise<PostDocument | null> {
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
            blogName: foundBlog.name,
            likesCount: {
                likesCount: 0,
                dislikesCount: 0
            }
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
            likesCount: {
                likesCount: 0,
                dislikesCount: 0
            }
        }
        return await this.postsRepository.create(newPost);
    }

    async update(id: string, dto: PostInputDto): Promise<number> {
        return await this.postsRepository.update(id, dto);
    }

    async delete(id: string): Promise<number> {
        return await this.postsRepository.delete(id);
    }

    async changeLikeStatus(userId: string, postId: string, likeStatus: string): Promise<boolean> {

        const foundPost = await this.postsRepository.findById(postId);
        if (!foundPost) {
            return false;
        }

        const foundLike = await this.postsLikesRepository.findLike(userId, postId);
        if (!foundLike) {
            const newLike = PostsLikesModel.createLike(userId, postId, likeStatus);
            await this.postsLikesRepository.save(newLike)
            // await this.postsLikesRepository.createLike(userId, postId, likeStatus);
            const likesCount = await PostsLikesModel.calculateLikesForPost(postId)
            const dislikesCount = await PostsLikesModel.calculateDislikesForPost(postId)
            foundPost.likesCount.likesCount = likesCount
            foundPost.likesCount.dislikesCount = dislikesCount
            await this.postsRepository.save(foundPost);
            return true;
        }
        foundLike.createdAt = new Date();
        foundLike.status = likeStatus;
        await this.postsLikesRepository.save(foundLike);
        const likesCount = await PostsLikesModel.calculateLikesForPost(postId)
        const dislikesCount = await PostsLikesModel.calculateDislikesForPost(postId)
        foundPost.likesCount.likesCount = likesCount
        foundPost.likesCount.dislikesCount = dislikesCount
        console.log(foundPost.likesCount)
        await this.postsRepository.save(foundPost);

        return true
    }

}