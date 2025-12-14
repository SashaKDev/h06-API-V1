import {param} from 'express-validator';

export const idValidation = param('id')
    .isString()
    .withMessage('Must be string')
    .isMongoId()
    .withMessage('Must be MongoId');