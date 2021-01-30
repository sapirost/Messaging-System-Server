import { NextFunction, Request, Response } from 'express';
import { ExceptionCode } from '../enums/exception_code';

export interface IErrorResponse {
    message: string;
    params?: any;
    status: string;
}

export const handleError = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const response: IErrorResponse = {
        status: 'ERROR',
        message: typeof err === 'string' ? err : err.message || 'Unexpected error was caught'
    };

    if (err.params) {
        response.params = err.params;
    }

    return res.status(err.httpCode || ExceptionCode.INTERNAL_SERVER).json(response);
};
