import { TListMiddlewareContext } from './types/TListMiddlewareContext';
import { TListAction } from './types/TListAction';
import { cookie } from 'Env/Env';
import { isEqual as oIsEqual } from 'Types/object';

enum LogType {
    None = 'None',
    All = 'All',
    ActionsOnly = 'ActionsOnly',
    Actions = 'Actions',
    Middlewares = 'Middlewares',
    Changes = 'Changes',
    Time = 'Time',
}
const COOKIE_LOG_KEY = 'ListInteractorDebug';

// Позже система логирования выедет из этого модуля и будет подгружаться в дебаге
let LOG_TYPE: LogType;

(() => {
    LOG_TYPE = LogType[cookie.get(COOKIE_LOG_KEY) as LogType] || LogType.None;
})();

const BACKGROUND_COLOR = '#222';
const ACTION_COLOR = '#ffca3a';
const MIDDLEWARE_COLOR = '#c77dff';
const ERROR_COLOR = '#d32f2f';
const WARRNING_COLOR = '#f57c00';
// const SUCCESS_COLOR = '#388e3c';
const ACTION_PREFIX = '[A] ';
const MIDDLEWARE_PREFIX = '[M] ';

export const LOG_SYMBOLS = {
    FROM: Symbol('LOG_SYMBOLS::FROM'),
};

export function withLogger(ctx: TListMiddlewareContext, name: string): TListMiddlewareContext {
    const dispatch: typeof ctx.dispatch = async (action) =>
        ctx.dispatch({
            ...action,
            [LOG_SYMBOLS.FROM]: name,
        });

    return {
        ...ctx,
        dispatch,
    };
}

// eslint-disable-next-line no-console
const groupCollapsed = (...args: unknown[]) => console.groupCollapsed(...args);
// eslint-disable-next-line no-console
const groupEnd = () => console.groupEnd();
// eslint-disable-next-line no-console
const info = (...args: unknown[]) => console.log(...args);
// eslint-disable-next-line no-console
const trace = (...args: unknown[]) => console.trace(...args);
// eslint-disable-next-line no-console
const time = (label?: string) => console.time(label);
// eslint-disable-next-line no-console
const timeEnd = (label?: string) => console.timeEnd(label);

const getActionSender = (action: TListAction) => {
    // @ts-ignore
    const from = action[exports.LOG_SYMBOLS.FROM];
    if (from) {
        return `${MIDDLEWARE_PREFIX}${from}`;
    }
    return '';
};

const withActionSender = (array: string[], action: TListAction, invert: boolean = false) => {
    const result = [...array];
    const sender = getActionSender(action);
    if (sender) {
        if (invert) {
            result.push(` from ${sender}`);
        } else {
            result.unshift(`${sender} -> `);
        }
    }
    return result;
};

const getActionDescription = (action: TListAction, invert: boolean = false) => {
    return withActionSender([`${ACTION_PREFIX}${action.type}`], action, invert).join('');
};

const logAction = (action: TListAction) => {
    if (LOG_TYPE === LogType.None || LOG_TYPE === LogType.Time || LOG_TYPE === LogType.Changes) {
        return;
    }
    if (LOG_TYPE === LogType.All) {
        info(`${getActionDescription(action)}`, action.payload);
    } else if (LOG_TYPE === LogType.ActionsOnly) {
        info(
            `%c${ACTION_PREFIX}${action.type}`,
            `background: ${BACKGROUND_COLOR}; color: ${ACTION_COLOR}`,
            action.payload
        );
    } else if (LOG_TYPE === LogType.Actions) {
        const sender = withActionSender([], action).join('');
        info(
            `%c${sender}%c${ACTION_PREFIX}${action.type}`,
            `background: ${BACKGROUND_COLOR}; color: ${MIDDLEWARE_COLOR}`,
            `background: ${BACKGROUND_COLOR}; color: ${ACTION_COLOR}`,
            action.payload
        );
    }
};

const getMiddlewareLogger = ({
    name,
    actionsNames,
    comment,
}: {
    name: string;
    actionsNames?: string[];
    comment?: string;
}) => {
    const check = (action?: TListAction) =>
        !!actionsNames && action ? actionsNames.includes(action.type) : true;

    return {
        enter: (action?: TListAction, msg?: string) => {
            if (
                LOG_TYPE === LogType.None ||
                !(LOG_TYPE === LogType.Middlewares || LOG_TYPE === LogType.All) ||
                !check(action)
            ) {
                return;
            }

            const getComment = () => (msg || comment ? ' //' + (msg || comment) : '');

            const result = [];

            result.push(
                `%c${MIDDLEWARE_PREFIX}${name}${getComment()}`,
                `background: ${BACKGROUND_COLOR}; color: ${MIDDLEWARE_COLOR}`
            );

            if (action) {
                if (LOG_TYPE === LogType.Middlewares) {
                    result[0] = `${getActionDescription(action)} -> ` + result[0];
                } else {
                    result[0] = `%c${getActionDescription(action)} -> ` + result[0];
                    result.splice(1, 0, `background: ${BACKGROUND_COLOR}; color: ${ACTION_COLOR}`);
                }
            }

            groupCollapsed(...result);
        },
        exit: (action?: TListAction) => {
            if (
                LOG_TYPE === LogType.None ||
                !(LOG_TYPE === LogType.Middlewares || LOG_TYPE === LogType.All) ||
                !check(action)
            ) {
                return;
            }
            groupEnd();
        },
        info: (...args: unknown[]) => {
            if (
                LOG_TYPE === LogType.None ||
                !(LOG_TYPE === LogType.Middlewares || LOG_TYPE === LogType.All)
            ) {
                return;
            }
            info(`${MIDDLEWARE_PREFIX}${name}`, ...args);
        },
    };
};

export const Logger = {
    info: (...args: unknown[]) => {
        if (LOG_TYPE === LogType.All) {
            info(...args);
        }
    },
    logAction,
    getMiddlewareLogger,
    create: (dispatchSessionId: string | number, prevState: object, nextState: object) => {
        const idName = dispatchSessionId ? `${dispatchSessionId} ` : '';
        const timerLabel =
            LOG_TYPE === LogType.Time
                ? dispatchSessionId
                    ? `Dispatch ${dispatchSessionId}`
                    : 'dispatched'
                : 'dispatched';

        return {
            start: () => {
                if (LOG_TYPE === LogType.None) {
                    return;
                }

                if (LOG_TYPE === LogType.Time) {
                    time(timerLabel);
                    return;
                } else {
                    info(`=== START ${idName}===`);
                    time(timerLabel);
                }

                if (prevState && nextState) {
                    groupCollapsed('changes');

                    Array.from(
                        new Set([...Object.keys(prevState), ...Object.keys(nextState)])
                    ).forEach((name) => {
                        // @ts-ignore
                        if (prevState[name] !== nextState[name]) {
                            // @ts-ignore
                            if (isEqual(prevState[name], nextState[name])) {
                                info(
                                    `%c${name}`,
                                    `background: ${BACKGROUND_COLOR}; color: ${WARRNING_COLOR}`,
                                    // @ts-ignore
                                    [prevState[name], nextState[name]]
                                );
                            } else {
                                info(
                                    name,
                                    // @ts-ignore
                                    [prevState[name], nextState[name]]
                                );
                            }
                        } else {
                            // @ts-ignore
                            if (!isEqual(prevState[name], nextState[name])) {
                                info(
                                    `%c${name}`,
                                    `background: ${BACKGROUND_COLOR}; color: ${ERROR_COLOR}`,
                                    // @ts-ignore
                                    [prevState[name], nextState[name]]
                                );
                            }
                        }
                    }, {});

                    groupEnd();
                }
                groupCollapsed('trace');
                trace();
                groupEnd();
            },
            end: () => {
                if (LOG_TYPE === LogType.None) {
                    return;
                }

                timeEnd(timerLabel);

                if (LOG_TYPE === LogType.Time) {
                    return;
                }

                info(`==== END ${idName}====`);
            },
        };
    },
};

function isEqual(obj1: unknown, obj2: unknown): boolean {
    if (oIsEqual(obj1, obj2)) {
        return true;
    }

    if (obj1 instanceof Map && obj2 instanceof Map) {
        return (
            obj1.size === obj2.size &&
            oIsEqual(Array.from(obj1.entries()), Array.from(obj2.entries()))
        );
    }

    return false;
}
