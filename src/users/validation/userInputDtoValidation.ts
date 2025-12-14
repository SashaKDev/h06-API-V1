import {body} from 'express-validator';

const loginValidation = body('login')
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('Invalid login')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Invalid login')

const passwordValidation = body('password')
    .isLength({min: 6, max: 20})
    .withMessage('Password must be from 6 to 20 length')

const emailValidation = body('email')
    .isEmail()
    .withMessage('Invalid email')

export const userInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
]