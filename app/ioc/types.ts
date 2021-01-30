export const TYPES = {
    // General
    Config: Symbol.for('Config'),

    // Emitters
    EventEmitter: Symbol.for('EventEmitter'),

    // Dal
    AuthenticationDal: Symbol.for('AuthenticationDal'),
    MessageDal: Symbol.for('MessageDal'),

    // Middleware
    AuthMiddleware: Symbol.for('AuthMiddleware'),
    ErrorMiddleware: Symbol.for('ErrorMiddleware'),

    // Services
    AuthenticationService: Symbol.for('AuthenticationService'),
    MessageService: Symbol.for('MessageService'),
};
