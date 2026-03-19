import {body} from 'express-validator'

export const passwordValidation = body('newPassword')
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('Invalid password')