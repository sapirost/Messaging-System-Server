import { ApplicationException } from './../utils/application_exception';
import { inject } from 'inversify';
import { AuthenticationDal } from '../dal/authentication_dal';
import { provide } from '../ioc/ioc';
import { TYPES } from '../ioc/types';
@provide(TYPES.AuthenticationService)
export class AuthenticationService {
    @inject(TYPES.AuthenticationDal)
    private authenticationDal: AuthenticationDal;

    public async login(email: string, password: string): Promise<string> {
        const results = await this.authenticationDal.login(email, password);

        if (results instanceof ApplicationException) {
            throw results;
        }

        return results;
    }

    public async register(email: string, password: string): Promise<string> {
        return this.authenticationDal.register(email, password);
    }
}
