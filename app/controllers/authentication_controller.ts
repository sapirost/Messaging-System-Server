import { NextFunction, Request, Response } from 'express';
import { controller, httpPost, interfaces, next, request, response } from 'inversify-express-utils';
import { isEmpty } from 'lodash';
import { ExceptionCode } from '../enums/exception_code';
import { IRequest } from '../interfaces/i_request';
import { lazyInject } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { AuthenticationService } from '../services/authentication_service';
import { ApplicationException } from '../utils/application_exception';

@controller('/auth')
export class AuthenticationController implements interfaces.Controller {
    @lazyInject(TYPES.AuthenticationService)
    private authenticationService: AuthenticationService;

    @httpPost('/login')
    public async login(@request() req: IRequest, @response() res: Response, @next() esNext: NextFunction) {
        try {
            const { email, password } = req.body;

            if (isEmpty(email) || isEmpty(password)) {
                throw new ApplicationException(ExceptionCode.BAD_REQUEST, 'Must provide email and password');
            }

            const token = await this.authenticationService.login(email, password);

            return res.json(token);
        } catch (err) {
            esNext(err);
        }
    }

    @httpPost('/register')
    public async register(@request() req: Request, @response() res: Response, @next() _esNext: NextFunction) {
        const { email, password } = req.body;

        if (isEmpty(email) || isEmpty(password)) {
            throw new ApplicationException(ExceptionCode.BAD_REQUEST, 'Must provide email and password');
        }

        const token = await this.authenticationService.register(email, password);

        return res.json(token);
    }
}
