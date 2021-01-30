import { NextFunction, Response } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { verify } from 'jsonwebtoken';
import { config } from '../../configs/config';
import { ExceptionCode } from '../enums/exception_code';
import { IRequest } from '../interfaces/i_request';
import { provide } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { ApplicationException } from './../utils/application_exception';

@provide(TYPES.AuthMiddleware)
export class AuthMiddleware extends BaseMiddleware {
    constructor() {
        super();
    }

    public handler(req: IRequest, _res: Response, next: NextFunction) {
        const token = req.headers.authorization;

        if (!token) {
            return next(new ApplicationException(ExceptionCode.UNAUTHORIZED, 'Unauthorized'));
        }

        verify(token.toString(), config.authentication.jwtAppSecret, (err: any, user: any) => {
            if (err) {
                return next(new ApplicationException(ExceptionCode.UNAUTHORIZED, 'Unauthorized'));
            }

            req.user = user;
            next();
        });
    }
}
