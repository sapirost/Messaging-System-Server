import { Container, decorate, inject, injectable, interfaces } from 'inversify';
import { buildProviderModule, fluentProvide, provide } from "inversify-binding-decorators";
import getDecorators from 'inversify-inject-decorators'; // tslint:disable-line:import-name
import { TYPES } from './types';
import { EventEmitter } from 'events';
import { config } from '../../configs/config';

type Identifier = string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>;

const container = new Container();
container.bind<any>(TYPES.Config).toConstantValue(config);
container.bind<any>(TYPES.EventEmitter).toConstantValue(new EventEmitter());

const decObject = getDecorators(container, false);
const lazyInject = decObject.lazyInject;

const provideNamed = (identifier: Identifier, name: string) =>
    fluentProvide(identifier)
        .whenTargetNamed(name)
        .done();

const provideSingleton = (identifier: Identifier) => {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done(true);
};

const loadServices = () => container.load(buildProviderModule());

export { container, provide, provideSingleton, provideNamed, inject, decorate, injectable, lazyInject, loadServices };

