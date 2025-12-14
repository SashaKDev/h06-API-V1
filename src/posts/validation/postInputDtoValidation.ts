import {body} from "express-validator";

const titleValidation = body('title')
    .isString()
    .withMessage('Title should be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Wrong title length');

const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('Description should be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Wrong description length');

const contentValidation = body('content')
    .isString()
    .withMessage('Content should be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Wrong content length');

const blogIdValidation = body('blogId')
    .optional()
    .isString()
    .withMessage('Blog ID should be a string')
    .trim()
    .isMongoId()
    .withMessage('Must be MongoId');


export const postInputDtoValidation =
    [
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        blogIdValidation,
    ]
