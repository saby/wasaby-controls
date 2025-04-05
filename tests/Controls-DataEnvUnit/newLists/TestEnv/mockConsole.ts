import { loadSync } from 'WasabyLoader/ModulesLoader';

const METHODS_TO_MOCK = [
    'info',
    'warn',
    'error',
    'group',
    'groupCollapsed',
    'groupEnd',
    'trace',
] as const;

type MockedMethod = (typeof METHODS_TO_MOCK)[number];

export class MockConsole {
    private _originConsole: Console;
    private _originInfo: (typeof import('Application/Env'))['logger']['info'];
    private _originWarn: (typeof import('Application/Env'))['logger']['warn'];
    private _originError: (typeof import('Application/Env'))['logger']['error'];
    private _consoleHistory: Record<MockedMethod, unknown[]> = getEmptyConsoleData();

    get info() {
        return this._consoleHistory.info;
    }

    get warns() {
        return this._consoleHistory.warn;
    }

    get errors() {
        return this._consoleHistory.error;
    }

    protected constructor() {}

    getHistoryByNamespace(namespace: MockedMethod) {
        return this._consoleHistory[namespace];
    }

    writeInfoInOriginConsole(...data: unknown[]) {
        this._originConsole.info(...data);
    }

    writeWarnInOriginConsole(...data: unknown[]) {
        this._originConsole.warn(...data);
    }

    writeErrorInOriginConsole(...data: unknown[]) {
        this._originConsole.error(...data);
    }

    init() {
        this._originConsole = { ...console };
        this._originInfo =
            loadSync<typeof import('Application/Env')>('Application/Env').logger.info;
        this._originWarn =
            loadSync<typeof import('Application/Env')>('Application/Env').logger.warn;
        this._originError =
            loadSync<typeof import('Application/Env')>('Application/Env').logger.error;

        const getMockFn = (key: MockedMethod) =>
            jest.fn((...args) => {
                const methodHistory = this._consoleHistory[key];
                if (methodHistory) {
                    methodHistory.push(...args);
                } else {
                    this._consoleHistory[key] = [...args];
                }
            });

        METHODS_TO_MOCK.forEach((method) => {
            // eslint-disable-next-line no-console
            console[method] = getMockFn(method);
        });

        loadSync<typeof import('Application/Env')>('Application/Env').logger.info =
            getMockFn('info');

        loadSync<typeof import('Application/Env')>('Application/Env').logger.warn =
            getMockFn('warn');
        loadSync<typeof import('Application/Env')>('Application/Env').logger.error =
            getMockFn('error');
    }

    clearHistory(namespace?: MockedMethod) {
        if (namespace) {
            this._consoleHistory[namespace] = [];
        } else {
            this._consoleHistory = getEmptyConsoleData();
        }
    }

    destroy() {
        if (MockConsole._instance) {
            console = this._originConsole;
            loadSync<typeof import('Application/Env')>('Application/Env').logger.info =
                this._originInfo;
            loadSync<typeof import('Application/Env')>('Application/Env').logger.warn =
                this._originWarn;
            loadSync<typeof import('Application/Env')>('Application/Env').logger.error =
                this._originError;
            MockConsole._instance = undefined;
        }
    }

    private static _instance: MockConsole | undefined;

    static getInstance(): MockConsole {
        if (!MockConsole._instance) {
            MockConsole._instance = new MockConsole();
        }

        return MockConsole._instance;
    }
}

function getEmptyConsoleData(): Record<MockedMethod, unknown[]> {
    return METHODS_TO_MOCK.reduce(
        (acc, method) => {
            acc[method] = [];
            return acc;
        },
        {} as Record<MockedMethod, unknown[]>
    );
}
