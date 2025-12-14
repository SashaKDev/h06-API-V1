import {Request, Response} from 'express';
import {BlogInputDto} from "../../dto/blog-input.dto";
import {blogsService} from "../../application/blogsService";
import {blogsQueryRepository} from "../../repositories/blogsQueryRepository";

export const createBlogHandler = async (req: Request, res: Response) => {

    const newBlog: BlogInputDto = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const createdBlogId = await blogsService.create(newBlog);
    const createdBlogViewModel = await blogsQueryRepository.findById(createdBlogId);

    res
        .status(201)
        .json(createdBlogViewModel);

}