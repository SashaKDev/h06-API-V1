import {Request, Response} from "express";
import {BlogInputDto} from "../../dto/blog-input.dto";
import {blogsService} from "../../application/blogsService";

export const updateBlogHandler = async (req: Request, res: Response) => {

    const dto: BlogInputDto = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const updateResult = await blogsService.update(req.params.id, dto);
    if (!updateResult) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);

}