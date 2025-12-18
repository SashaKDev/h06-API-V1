import {param} from 'express-validator';

export const idValidation = param('id')
    .isMongoId()
    .withMessage('Must be MongoId');