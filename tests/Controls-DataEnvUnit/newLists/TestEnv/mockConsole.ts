import { loadSync } from 'WasabyLoader/ModulesLoader';

export const init = () => {
    let _originInfo: (typeof import('Application/Env'))['logger']['info'];
    let _originWarn: (typeof import('Application/Env'))['logger']['warn'];
    let _originError: (typeof import('Application/Env'))['logger']['error'];
    let consoleInfo: unknown[][] = [];
    let consoleWarns: unknown[][] = [];
    let consoleErrors: unknown[][] = [];

    return {
        get info() {
            return consoleInfo;
        },
        get warns() {
            return consoleWarns;
        },
        get errors() {
            return consoleErrors;
        },
        beforeAll: () => {
            _originInfo = loadSync<typeof import('Application/Env')>('Application/Env').logger.info;
            _originWarn = loadSync<typeof import('Application/Env')>('Application/Env').logger.warn;
            _originError =
                loadSync<typeof import('Application/Env')>('Application/Env').logger.error;

            loadSync<typeof import('Application/Env')>('Application/Env').logger.info = jest.fn(
                (...args) => {
                    consoleInfo.push(...args);
                    // throw Error(...args);
                }
            );
            loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = jest.fn(
                (...args) => {
                    consoleWarns.push(...args);
                    // throw Error(...args);
                }
            );
            loadSync<typeof import('Application/Env')>('Application/Env').logger.error = jest.fn(
                (...args) => {
                    consoleErrors.push(...args);
                    // throw Error(...args);
                }
            );
        },

        beforeEach: () => {
            consoleInfo = [];
            consoleWarns = [];
            consoleErrors = [];
        },

        afterAll: () => {
            loadSync<typeof import('Application/Env')>('Application/Env').logger.info = _originInfo;
            loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = _originWarn;
            loadSync<typeof import('Application/Env')>('Application/Env').logger.error =
                _originError;
        },
    };
};
