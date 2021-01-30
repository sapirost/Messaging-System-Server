// tslint:disable:no-console
import 'reflect-metadata';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import expressHttpContext from 'express-http-context';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container, loadServices } from './app/ioc/ioc';
import './app/ioc/loader';
import { TYPES } from './app/ioc/types';
import { handleError } from './app/middleware/error_middleware';
import morgan from 'morgan';
import firebase from 'firebase';

loadServices();
const config = container.get<any>(TYPES.Config);
const expressApp = express();

const server = new InversifyExpressServer(container, null, null, expressApp);

server.setConfig((eApp) => {
    eApp.use(morgan(config.system.morganFormat));
    eApp.use(helmet());
    eApp.use(cors({ origin: [/localhost/i, /messaging-communication-system.herokuapp\.com/i] }));
    eApp.use(express.urlencoded({ extended: true, limit: '5mb' }));
    eApp.use(express.json({ limit: '5mb' }));
    expressApp.use(compression());
    eApp.use(expressHttpContext.middleware);
});

server.setErrorConfig((eApp) => {
    eApp.use(handleError);
});

// Initialize third party database
firebase.initializeApp(config.firebaseService);
console.log("🚀 ~ file: server.ts ~ line 44 ~ config.firebaseService", config.firebaseService)

const appPort = process.env.PORT || config.system.serverPort || 3000;

const app = server.build();
app.listen(appPort, () => {
    console.log(`[${config.system.appName}]`, `server is running! listening to port ${appPort}`);
});