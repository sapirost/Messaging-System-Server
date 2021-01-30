import { IFilteredMessages, IMessage } from '../interfaces/i_message';
import { lazyInject, provide } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { v4 as uuidv4 } from 'uuid';
import { MessageDal } from '../dal/message_dal';

@provide(TYPES.MessageService)
export class MessageService {
    @lazyInject(TYPES.MessageDal)
    private messageDal: MessageDal;

    public async delete(id: string): Promise<any> {
        return this.messageDal.deleteMessage(id);
    }

    public async getAllByEmail(email: string): Promise<IFilteredMessages> {
        return this.messageDal.getAllByEmail(email);
    }

    public async send(message: IMessage): Promise<IMessage> {
        const generatedId = this.generateId();
        const creationDate = new Date().toISOString();

        return this.messageDal.sendMessage(generatedId, { ...message, creationDate });
    }

    private generateId(): string {
        return uuidv4();
    }
}
