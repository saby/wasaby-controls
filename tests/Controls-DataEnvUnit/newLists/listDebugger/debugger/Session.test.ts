import { Session } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { TChange } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/ChangesStorage';
import * as ErrorDescriptors from 'Controls-DataEnv/newLists/_listDebug/ErrorDescriptors';
import { setupTestEnv } from 'Controls-DataEnvUnit/newLists/TestEnv/prepareEnvironment';

describe('Controls-DataEnv/newLists/_listDebug/debugger/Session', () => {
    const INITIAL_SESSION_STATE = { test: '123' };
    const INITIAL_SESSION_ACTIONS: TAbstractAction[] = [
        {
            type: 'INITIAL_SESSION_ACTION',
            payload: {},
        },
    ];

    const COMPLETE_ALL_PHASES = (session: Session) => {
        session.nextPhase({});
        session.nextPhase({});
        session.nextPhase({});
        session.nextPhase({});
        session.nextPhase({});
    };

    const RESULT_SESSION_STATE = { test: '456' };

    const { mockConsole } = setupTestEnv({ mockConsole: true });

    beforeEach(() => {
        jest.useFakeTimers({
            now: new Date('2024-12-13T10:40:00.123Z'),
        });
    });

    describe('Контроль начала и завершения, корректность состояний (автомат).', () => {
        describe('База.', () => {
            it('Правильная последовательность.', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    COMPLETE_ALL_PHASES(session);
                    session.endSession(RESULT_SESSION_STATE);
                }).not.toThrow();
            });

            it('Нельзя повторно начать сессию', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                }).toThrow(ErrorDescriptors.SESSION_ALREADY_EXISTS());
            });

            it('Можно начать не начатую фазу', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                }).not.toThrow();
            });

            it('Можно начать завершенную фазу (не начатая фаза = завершенная)', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    COMPLETE_ALL_PHASES(session);
                    session.endSession(RESULT_SESSION_STATE);

                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                }).not.toThrow();
            });

            it('Нельзя завершить не начатое', () => {
                expect(() => {
                    const session = new Session();
                    session.endSession(RESULT_SESSION_STATE);
                }).toThrow(ErrorDescriptors.MISSING_SESSION());
            });

            it('Нельзя завершить завершенное', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    COMPLETE_ALL_PHASES(session);
                    session.endSession(RESULT_SESSION_STATE);
                    session.endSession(RESULT_SESSION_STATE);
                }).toThrow(ErrorDescriptors.MISSING_SESSION());
            });
        });

        describe('Распространение действий.', () => {
            it('Правильная последовательность', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    session.startDispatch({
                        type: 'action',
                        payload: {},
                    });
                    session.endDispatch();
                    COMPLETE_ALL_PHASES(session);
                    session.endSession(RESULT_SESSION_STATE);
                }).not.toThrow();
            });

            it('Фаза должна быть запущена', () => {
                expect(() => {
                    const session = new Session();
                    session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                    session.endPhase({});
                    session.startDispatch({
                        type: 'action',
                        payload: {},
                    });
                    session.endSession(RESULT_SESSION_STATE);
                }).toThrow(ErrorDescriptors.PHASE_NOT_STARTED());
            });
        });

        it('Сессия обновления должна пройти все фазы.', () => {
            expect(() => {
                const session = new Session();
                session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                session.endSession(RESULT_SESSION_STATE);
            }).toThrow(ErrorDescriptors.NOT_ALL_PHASES_COMPLETED());

            expect(mockConsole.info[0]).toBe(
                '%c' + String(ErrorDescriptors.NOT_ALL_PHASES_COMPLETED())
            );
        });
    });

    describe('meta информация', () => {
        it('meta всегда определена', () => {
            expect(new Session().getMeta()).toBeDefined();

            const session1 = new Session();

            session1.startSession({}, []);
            expect(session1.getMeta()).toBeDefined();

            const session2 = new Session();
            session2.startSession({}, []);
            COMPLETE_ALL_PHASES(session2);
            session2.endSession({});
            expect(session2.getMeta()).toBeDefined();
        });

        it('meta информация при начале и завершении операции', () => {
            const session = new Session();
            session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);

            expect(session.getMeta().initialState).toBe(INITIAL_SESSION_STATE);
            expect(session.getMeta().apiCalls).toBe(INITIAL_SESSION_ACTIONS);

            expect(session.getMeta().process).toBeUndefined();
            expect(session.getMeta().sliceUpdates).toBeUndefined();
            expect(session.getMeta().changes).toBeUndefined();
            expect(session.getMeta().phases).toBeUndefined();
            expect(session.getMeta().resultState).toBeUndefined();

            COMPLETE_ALL_PHASES(session);
            session.endSession(RESULT_SESSION_STATE);
            expect(session.getMeta().initialState).toBe(INITIAL_SESSION_STATE);
            expect(session.getMeta().apiCalls).toBe(INITIAL_SESSION_ACTIONS);
            expect(session.getMeta().process).toBeDefined();
            expect(session.getMeta().sliceUpdates).toBeDefined();
            expect(session.getMeta().changes).toBeDefined();
            expect(session.getMeta().phases).toBeDefined();
            expect(session.getMeta().resultState).toBe(RESULT_SESSION_STATE);
        });

        it('meta информация сбрасывается при рестарте фазы', () => {
            const session = new Session();
            session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
            COMPLETE_ALL_PHASES(session);
            session.endSession(RESULT_SESSION_STATE);

            const INITIAL_SESSION_STATE_2 = {
                v: 'INITIAL_SESSION_STATE_2',
            };
            const RESULT_SESSION_STATE_2 = {
                v: 'RESULT_SESSION_STATE_2',
            };

            const INITIAL_SESSION_ACTIONS_2: TAbstractAction[] = [
                {
                    type: 'INITIAL_SESSION_ACTIONS_2',
                    payload: {},
                },
            ];

            session.startSession(INITIAL_SESSION_STATE_2, INITIAL_SESSION_ACTIONS_2);
            expect(session.getMeta().initialState).toBe(INITIAL_SESSION_STATE_2);
            expect(session.getMeta().apiCalls).toBe(INITIAL_SESSION_ACTIONS_2);

            expect(session.getMeta().process).toBeUndefined();
            expect(session.getMeta().sliceUpdates).toBeUndefined();
            expect(session.getMeta().changes).toBeUndefined();
            expect(session.getMeta().phases).toBeUndefined();
            expect(session.getMeta().resultState).toBeUndefined();

            COMPLETE_ALL_PHASES(session);
            session.endSession(RESULT_SESSION_STATE_2);
            expect(session.getMeta().initialState).toBe(INITIAL_SESSION_STATE_2);
            expect(session.getMeta().apiCalls).toBe(INITIAL_SESSION_ACTIONS_2);
            expect(session.getMeta().process).toBeDefined();
            expect(session.getMeta().sliceUpdates).toBeDefined();
            expect(session.getMeta().changes).toBeDefined();
            expect(session.getMeta().phases).toBeDefined();
            expect(session.getMeta().resultState).toBe(RESULT_SESSION_STATE_2);
        });
    });

    describe('Время выполнения', () => {
        it('Время выполнения неизвестно до завершения фазы', () => {
            const session = new Session();
            expect(session.getMeta().duration).toBeUndefined();
            session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
            expect(session.getMeta().duration).toBeUndefined();
            COMPLETE_ALL_PHASES(session);
            session.endSession(RESULT_SESSION_STATE);
            expect(session.getMeta().duration).toBe(0);
        });

        it('Простой до начала фазы и после завершения не влияет на время выполнения', () => {
            const session = new Session();

            jest.advanceTimersByTime(110);

            session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
            jest.advanceTimersByTime(7);
            COMPLETE_ALL_PHASES(session);
            session.endSession(RESULT_SESSION_STATE);

            jest.advanceTimersByTime(136);

            expect(session.getMeta().duration).toBe(7);
        });
    });

    describe('innerSetState', () => {
        it('Вызов разрешен только внутри запущенной сессии и распространения', () => {
            expect(() => {
                const session = new Session();
                session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                session.startDispatch({ type: 'action', payload: {} });
                session.innerSetState({}, { a: 1 });
                session.endDispatch();
                COMPLETE_ALL_PHASES(session);
                session.endSession(RESULT_SESSION_STATE);

                const changes = session.getMeta().changes as TChange[];
                expect(changes).toBeDefined();
                expect(changes.length).toBe(1);
                expect(changes[0].key).toBe('a');
                expect(changes[0].prev).toBe(undefined);
                expect(changes[0].next).toBe(1);
            }).not.toThrow();
        });

        it('Не запустили сессию', () => {
            expect(() => {
                const session = new Session();
                session.innerSetState({}, { a: 1 });
            }).toThrow(ErrorDescriptors.MISSING_SESSION());
        });

        it('Не запустили распространение', () => {
            expect(() => {
                const session = new Session();
                session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                session.innerSetState({}, { a: 1 });
            }).toThrow(ErrorDescriptors.MISSING_DISPATCH());
        });
    });

    describe('immediateSetState', () => {
        it('Вызов разрешен только внутри запущенной сессии', () => {
            expect(() => {
                const session = new Session();
                session.startSession(INITIAL_SESSION_STATE, INITIAL_SESSION_ACTIONS);
                session.immediateSetState({}, { a: 1 });
                COMPLETE_ALL_PHASES(session);
                session.endSession(RESULT_SESSION_STATE);

                const changes = session.getMeta().changes as TChange[];
                expect(changes).toBeDefined();
                expect(changes.length).toBe(1);
                expect(changes[0].key).toBe('a');
                expect(changes[0].prev).toBe(undefined);
                expect(changes[0].next).toBe(1);
            }).not.toThrow();
        });
    });
});
