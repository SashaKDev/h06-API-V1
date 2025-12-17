import {Request, Response} from "express";
import {commentsService} from "../../../comments/application/commenstService";
import {commentsQueryRepository} from "../../../comments/repositories/commentsQueryRepository";
import {CommentsPaginationData} from "../../../comments/types/commentsPaginationData";
import {matchedData} from "express-validator";
import {postsService} from "../../application/postsService";

export const getCommentsForPostHandler = async (req: Request, res: Response) => {

    const data = matchedData(req, { locations: ['query'] });

    const commentsPaginationData: CommentsPaginationData = {
        pageSize: data.pageSize,
        pageNumber: data.pageNumber,
        sortBy: data.sortBy,
        sortDirection: data.sortDirection,
    }
    const foundPost = await postsService.findById(req.params.id);
    if (!foundPost) {
        res.sendStatus(404);
        return;
    }
    const foundComments = await commentsQueryRepository.findCommentsForPost(req.params.id, commentsPaginationData);
    res
        .status(200)
        .json(foundComments);

}