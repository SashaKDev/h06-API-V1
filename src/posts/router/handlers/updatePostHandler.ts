import {Request, Response} from 'express';
import {PostInputDto} from "../../dto/post-input.dto";
import {postsService} from "../../application/postsService";

export const updatePostHandler = async (req: Request, res: Response) => {

    const dto: PostInputDto = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId:	req.body.blogId,
    }
    const updateResult: number = await postsService.update(req.params.id, dto);
    if (!updateResult) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);

}