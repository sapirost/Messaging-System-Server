export interface IMessage {
    creationDate?: Date | string;
    id?: number;
    message: string;
    receiver: string;
    sender: string;
    subject: string;
}

export interface IFilteredMessages {
    received: IMessage[];
    sent: IMessage[];
}

