/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from '../../AbstractDispatcher/types/TAbstractAction';
import { TListAction } from '../types/TListAction';
import { TListMiddleware } from '../types/TListMiddleware';
import { TListMiddlewareContext } from '../types/TListMiddlewareContext';
import { IListState } from '../../interface/IListState';
import { logger } from 'Application/Env';
import type { TMiddlewareLoggerInstance } from 'Controls-DataEnv/listDebug';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

const Rejected = Symbol('Rejected');

type TListActionsWithSetState =
    | TListAction
    | TAbstractAction<
          'applyState',
          {
              state: IListState;
              applyStateStrategy: 'internal' | 'immediate';
          }
      >;

// @ts-ignore
export const state: (
    // @ts-ignore
    ctx: Omit<TListMiddlewareContext<TListActionsWithSetState>, 'getState'> & {
        setState: (state: IListState, applyStateStrategy: 'internal' | 'immediate') => void;
        getState: () => IListState;
    }
) => [TListMiddleware, TListMiddlewareContext['getState']] = (ctx) => {
    const debugLib = isLoaded('Controls-DataEnv/listDebug')
        ? loadSync<typeof import('Controls-DataEnv/listDebug')>('Controls-DataEnv/listDebug')
        : undefined;

    const {
        dispatch,
        getState: sliceGetState,
        setState: sliceSetState,
        // @ts-ignore
    } = (debugLib ? debugLib.addLoggerToContext(ctx, 'state') : ctx) as Omit<
        TListMiddlewareContext<TListActionsWithSetState>,
        'getState'
    > & {
        setState: (state: IListState, applyStateStrategy: 'internal' | 'immediate') => void;
        getState: () => IListState;
    };

    let masterDispatchPromise: Promise<void> | undefined;
    let isRejected = false;
    let savedState: IListState | undefined;
    let savedCallback: undefined | (() => Promise<void>);

    const setState = (partialState: Partial<IListState>) => {
        if (!savedState) {
            // Ошибка
            logger.error(
                `Внутренняя ошибка платформы.
                [Controls/_dataFactory/ListWebDispatcher/middlewares/state]::missing state!
                Во время асинхронной очереди был вызван setState, но перед запуском очереди он не был сохранен.
                Возможна коллизия состояний.`
            );
        }
        savedState = {
            ...savedState,
            ...partialState,
        };
    };
    const getState = () => savedState;

    let stateOwnActionsLogger: TMiddlewareLoggerInstance | undefined;

    if (debugLib) {
        stateOwnActionsLogger = debugLib.DispatcherLogger.getMiddlewareLogger({
            name: 'state',
            actionsNames: ['setState', 'applyState'],
            comment: 'Первый же экшен собственный',
        });
    }

    return [
        (next) => async (action: TListActionsWithSetState) => {
            if (isRejected) {
                debugLib?.DispatcherLogger.getMiddlewareLogger({
                    name: 'state',
                }).info(
                    `Экшен ${action.type} будет проигнорирован т.к. идет откат (rejectSetState).`
                );
                return;
            }

            // Мы ловим самый первый диспатч в цепочке и обрываем дальнейший вызов.
            // Перезапускаем цепочку, но уже в промисе, ждем результат выполнения всей цепочки.
            if (!masterDispatchPromise) {
                stateOwnActionsLogger?.enter(action);

                switch (action.type) {
                    case 'setState': {
                        await dispatch({
                            type: 'applyState',
                            payload: {
                                state: action.payload.state,
                                applyStateStrategy: action.payload.applyStateStrategy,
                            },
                        });
                        break;
                    }
                    case 'applyState': {
                        sliceSetState(
                            {
                                ...(savedState || sliceGetState()),
                                ...action.payload.state,
                            },
                            action.payload.applyStateStrategy || 'internal'
                        );
                        break;
                    }
                    case 'rejectSetState': {
                        // Тут нечего останавливать.
                        break;
                    }
                    default: {
                        debugLib?.DispatcherLogger.getMiddlewareLogger({
                            name: 'state',
                            comment: 'Оборачивание верхнего экшена в промис',
                        }).enter();

                        // Замораживаем
                        // Запоминаем текущий стейт слайса, дальше все изменения
                        // внутри этой цепочки будут изти относительно него
                        savedState = sliceGetState();

                        const onFinally = () => {
                            masterDispatchPromise = undefined;
                            savedState = undefined;
                            isRejected = false;
                            savedCallback = undefined;

                            debugLib?.DispatcherLogger.getMiddlewareLogger({
                                name: 'state',
                                comment: 'Оборачивание верхнего экшена в промис',
                            }).exit();
                        };

                        // Ожидание завершения этого первого dispatch = всей цепочки, которая за ним последует.
                        masterDispatchPromise = new Promise<void>((resolve, reject) => {
                            // Настоящий вложенный диспатч.
                            // В случае отмены, внутренний промис всё равно продолжает выполнение и
                            // может зарезолвить уже отмененный мастер промис или выполнять другие
                            // команды.
                            // В случае отмены нам нужно:
                            // 1) Возвести флаг отмены, чтобы никакие экшены больше не проходили.
                            // 2) Всё равно дождаться вложенного промиса.
                            dispatch(action)
                                .then(() => {
                                    if (isRejected) {
                                        // Отменили, но всё равно дождлись вложенного, теперь роняем мастер промис.
                                        reject(Rejected);
                                    } else {
                                        resolve();
                                    }
                                })
                                .catch(reject);
                        })
                            .then(() => {
                                debugLib?.DispatcherLogger.info(
                                    'Успешное завершение верхнего экшена.'
                                );

                                if (!savedCallback) {
                                    debugLib?.DispatcherLogger.info('Состояние не менялось.');
                                    return;
                                }

                                debugLib?.DispatcherLogger.info(
                                    'Начало применения финального состояния.'
                                );

                                Promise.resolve(savedCallback()).then(() => {
                                    debugLib?.DispatcherLogger.info(
                                        'Конец применения финального состояния.'
                                    );
                                });
                            })
                            .then(() => {
                                onFinally();
                            })
                            .catch((e) => {
                                if (e === Rejected) {
                                    // Промис был отменен, глушим.
                                    // Ошибка вложенного промиса обработана выше.
                                    debugLib?.DispatcherLogger.info(
                                        'Установка состояния прервана вручную.'
                                    );
                                } else {
                                    logger.error(e);
                                }
                                onFinally();
                            });

                        await masterDispatchPromise;
                        break;
                    }
                }

                stateOwnActionsLogger?.exit(action);
            } else {
                stateOwnActionsLogger?.enter(
                    action,
                    `экшен ${action.type} в процессе асинхронного обхода логики`
                );

                switch (action.type) {
                    case 'setState': {
                        if (action.payload.applyStateStrategy === 'immediate') {
                            await dispatch({
                                type: 'applyState',
                                payload: {
                                    state: action.payload.state,
                                    applyStateStrategy: action.payload.applyStateStrategy,
                                },
                            });
                        }
                        // Запоминаем стейт в локальное состояние мидлвары.
                        // Оно актуально в рамках прохода.
                        setState(action.payload.state);

                        stateOwnActionsLogger?.info(
                            'Запомнили состояние',
                            action.payload.state,
                            'текущее',
                            getState()
                        );

                        // После окончания всей цепочки устанавливаем
                        // актуальное на тот момент состояние
                        if (!savedCallback) {
                            savedCallback = async () => {
                                await dispatch({
                                    type: 'applyState',
                                    payload: {
                                        // Не может быть undefined
                                        state: getState() as IListState,
                                        applyStateStrategy: 'internal',
                                    },
                                });
                            };
                        }
                        break;
                    }
                    case 'applyState': {
                        sliceSetState(action.payload.state, action.payload.applyStateStrategy);
                        stateOwnActionsLogger?.info('Применили состояние', action.payload.state);
                        break;
                    }
                    case 'rejectSetState': {
                        if (!!masterDispatchPromise) {
                            debugLib?.DispatcherLogger.getMiddlewareLogger({
                                name: 'state',
                            }).info('ОТМЕНА ПРИМЕНЕНИЯ (rejectSetState).');
                            isRejected = true;

                            // Экшен отмены тоже занимает время, его обязательно нужно ждать, если
                            // планируется дальнейшая работа с диспатчером.
                            // При разрушении ждать нет необходимости, никаких действий выполнено не будет,
                            // но сам диспатчер станет недееспособным.
                            await masterDispatchPromise;
                        }
                        break;
                    }
                    default: {
                        next(action as TListAction);
                    }
                }

                stateOwnActionsLogger?.exit(action);
            }
        },
        getState,
    ];
};
