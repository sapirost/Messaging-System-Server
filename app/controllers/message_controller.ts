import { isEmpty } from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, interfaces, next, request, response } from 'inversify-express-utils';
import { lazyInject } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { MessageService } from '../services/message_service';
import { IRequest } from '../interfaces/i_request';
import { ExceptionCode } from '../enums/exception_code';
import { ApplicationException } from '../utils/application_exception';

@controller('/message', TYPES.AuthMiddleware)
export class MessageController implements interfaces.Controller {
    @lazyInject(TYPES.MessageService)
    private messageService: MessageService;

    @httpDelete('/:id')
    public async delete(@request() req: Request, @response() res: Response, @next() _esNext: NextFunction) {
        const results = await this.messageService.delete(req.params.id);

        return res.json(results);
    }

    @httpGet('/')
    public async getAll(@request() req: IRequest, @response() res: Response, @next() _esNext: NextFunction) {
        const { email } = req.user;
        const results = await this.messageService.getAllByEmail(email);

        return res.json(results);
    }

    @httpPost('/')
    public async send(@request() req: IRequest, @response() res: Response, @next() _esNext: NextFunction) {
        const { email } = req.user;
        const { message, receiver, subject } = req.body;

        if (isEmpty(message) || isEmpty(receiver) || isEmpty(subject)) {
            throw new ApplicationException(ExceptionCode.BAD_REQUEST, 'Must provide message,subject and receiver');
        }

        const results = await this.messageService.send({ message, receiver, subject, sender: email });

        return res.json(results);
    }
}
