import {body} from "express-validator";

const commentContentValidation = body('content')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Wrong length');

export const commentInputDtoValidation = [
    commentContentValidation,
]