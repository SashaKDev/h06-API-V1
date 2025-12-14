
import {body} from "express-validator";

const nameValidation = body('name')
    .isString()
    .withMessage('Name must be string')
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Wrong name length');

const descriptionValidation = body('description')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('Wrong description length');

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .withMessage('URL must be string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Wrong URL length')
    .isURL()
    .withMessage('URL must be a valid URL');

export const blogsInputDtoValidation =
    [
        nameValidation,
        descriptionValidation,
        websiteUrlValidation,
    ]
