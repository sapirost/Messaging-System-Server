import { ExceptionCode } from "../enums/exception_code";

export class ApplicationException extends Error {
    public httpCode: ExceptionCode;
    public message: string;
    public params: any;

    constructor(code: number, message: string, params?: any) {
        super();

        this.httpCode = code;
        this.message = message;
        this.params = params;
    }
}
