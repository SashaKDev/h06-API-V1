// import {Request, Response} from 'express';
// import {PostInputDto} from "../../../posts/dto/post-input.dto.js";
// import {postsService} from "../../../posts/application/postsService.js";
// import {postsQueryRepository} from "../../../posts/repositories/postsQueryRepository.js";
//
// export const createPostForBlogHandler = async (req: Request, res: Response) => {
//
//     const newPost: PostInputDto = {
//         blogId: req.params.id,
//         title: req.body.title,
//         shortDescription: req.body.shortDescription,
//         content: req.body.content,
//     }
//     const insertedPostId = await postsService.createForBlog(newPost);
//     if(!insertedPostId){
//         res.sendStatus(404);
//         return;
//     }
//     const insertedPost = await postsQueryRepository.findById(insertedPostId);
//     res
//         .status(201)
//         .json(insertedPost);
//
// }