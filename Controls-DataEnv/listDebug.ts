/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
