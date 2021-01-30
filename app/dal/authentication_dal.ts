import { lazyInject, provide } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
import { ExceptionCode } from '../enums/exception_code';
import { ApplicationException } from '../utils/application_exception';
import firebase from 'firebase';
import { sign } from 'jsonwebtoken';
import { FirebaseAuthErrorCode } from '../enums/firebase_auth_error_code';

@provide(TYPES.AuthenticationDal)
export class AuthenticationDal {
    @lazyInject(TYPES.Config)
    private config: any;

    private dbInstant: any;

    constructor() {
        this.dbInstant = firebase.auth();
    }

    public async login(email: string, password: string): Promise<string | ApplicationException> {
        return this.dbInstant.signInWithEmailAndPassword(email, password)
            .then((userCredential) => this.getUserToken(userCredential.user.uid, userCredential.user.email))
            .catch((error) => this.handleLoginError(error));
    }

    public async register(email: string, password: string): Promise<string> {
        return this.dbInstant.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => this.getUserToken(userCredential.user.uid, userCredential.user.email))
            .catch((error) => this.handleRegisterError(error));
    }

    private getUserToken(id: string, email: string): string {
        const { jwtAppSecret, jwtExpireTime: expiresIn } = this.config.authentication;

        return sign({ id, email }, jwtAppSecret, { expiresIn });
    }

    private handleLoginError(err: any): ApplicationException {
        const { INVALID_EMAIL, NOT_FOUND, WRONG_PASSWORD } = FirebaseAuthErrorCode;

        if (err.code === INVALID_EMAIL || err.code === NOT_FOUND || err.code === WRONG_PASSWORD) {
            return new ApplicationException(ExceptionCode.NOT_FOUND, 'User not found');
        }

        return new ApplicationException(ExceptionCode.INTERNAL_SERVER, err.message);
    }

    private handleRegisterError(err: any): ApplicationException {
        const { INVALID_PASSWORD, INVALID_EMAIL, ALREADY_EXIST } = FirebaseAuthErrorCode;

        if (err.code === ALREADY_EXIST) {
            throw new ApplicationException(ExceptionCode.ALREADY_EXIST, 'Email already in use');
        }

        if (err.code === INVALID_PASSWORD || err.code === INVALID_EMAIL) {
            throw new ApplicationException(ExceptionCode.BAD_REQUEST, 'Invalid email/password');
        }

        throw new ApplicationException(ExceptionCode.INTERNAL_SERVER, err.message);
    }
}
