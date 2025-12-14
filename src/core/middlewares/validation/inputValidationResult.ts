import {NextFunction, Request, Response} from "express";
import {FieldValidationError, ValidationError, validationResult} from "express-validator";

export const inputValidationResult = (req: Request, res: Response, next: NextFunction) => {

    const errorFormatter = (validationError: ValidationError) => {
        const fieldValidationError = validationError as FieldValidationError;

        return {
            message: fieldValidationError.msg,
            field: fieldValidationError.path,
        }
    }

    const errors = validationResult(req).formatWith(errorFormatter).array({onlyFirstError: true});

    if (errors.length) {
        res.status(400).json({errorsMessages: errors});
        return;
    }
    next();
}