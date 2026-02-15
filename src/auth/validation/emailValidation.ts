import {body} from 'express-validator'

export const emailValidation = body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')