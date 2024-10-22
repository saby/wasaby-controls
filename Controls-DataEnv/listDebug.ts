import {
    Logger as DispatcherLogger,
    withLogger as addLoggerToContext,
    COOKIE_LOG_KEY,
} from './newLists/_listDebug/Logger';

type TDispatcherLoggerInstance = ReturnType<(typeof DispatcherLogger)['create']>;
type TMiddlewareLoggerInstance = ReturnType<(typeof DispatcherLogger)['getMiddlewareLogger']>;
type TCookieLogKey = typeof COOKIE_LOG_KEY;

export {
    DispatcherLogger,
    addLoggerToContext,
    TCookieLogKey,
    TDispatcherLoggerInstance,
    TMiddlewareLoggerInstance,
};
