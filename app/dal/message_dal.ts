import { provide } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { ExceptionCode } from '../enums/exception_code';
import { ApplicationException } from '../utils/application_exception';
import firebase from 'firebase';
import { IFilteredMessages, IMessage } from '../interfaces/i_message';

@provide(TYPES.MessageDal)
export class MessageDal {
    private dbInstant: any;
    private MESSAGE_DB = '/messages';

    constructor() {
        // tslint:disable-next-line: no-console
        firebase.database.enableLogging(message => console.log("[FIREBASE-MESSAGE]", message));
        this.dbInstant = firebase.database();
    }

    public async deleteMessage(id: string): Promise<any> {
        return await this.dbInstant.ref(`${this.MESSAGE_DB}/${id}`)
            .remove()
            .catch((error) => {
                throw new ApplicationException(ExceptionCode.INTERNAL_SERVER, error.message);
            });
    }

    public async getAllByEmail(email: string): Promise<IFilteredMessages> {
        const sent = await this.getAndFilterByKey('sender', email);
        const received = await this.getAndFilterByKey('receiver', email);

        return { sent, received };
    }

    public async sendMessage(id: string, message: IMessage): Promise<IMessage> {
        return await this.dbInstant.ref(`${this.MESSAGE_DB}/${id}`)
            .set(message)
            .then((docRef) => docRef)
            .catch((error) => {
                throw new ApplicationException(ExceptionCode.INTERNAL_SERVER, error);
            });
    }

    private formatMessages(message: any): IMessage[] {
        if (!message) {
            return [];
        }

        return Object.entries(message).map(([key, val]: [string, any]) => ({ ...val, id: key }));
    }

    private async getAndFilterByKey(key: string, value: string): Promise<IMessage[]> {
        const messages = await this.dbInstant
            .ref(this.MESSAGE_DB)
            .orderByChild(key).equalTo(value).once('value')
            .then(snapshot => snapshot && snapshot.val());

        return this.formatMessages(messages);
    }
}
