import {body} from "express-validator";

enum likeStatuses {
    None = "None",
    Like = "Like",
    Dislike = "Dislike",

}

export const likeStatusInputValidation = body('likeStatus')
    .trim()
    .isIn(Object.values(likeStatuses))
    .withMessage('Wrong like status');
