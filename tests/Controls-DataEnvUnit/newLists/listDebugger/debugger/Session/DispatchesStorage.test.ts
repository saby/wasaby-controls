import { DispatchesStorage } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/DispatchesStorage';
import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { loadSync } from 'WasabyLoader/ModulesLoader';

describe('Controls-DataEnv/newLists/_listDebug/debugger/session/DispatchesStorage', () => {
    const ABSTRACT_ACTION: TAbstractAction = {
        type: '',
        payload: {},
    };

    let __originWarn: (typeof import('Application/Env'))['logger']['warn'];
    let consoleWarns: unknown[][] = [];

    beforeAll(() => {
        __originWarn = loadSync<typeof import('Application/Env')>('Application/Env').logger.warn;
        loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = jest.fn(
            (...args) => {
                consoleWarns.push(...args);
            }
        );
    });

    afterAll(() => {
        loadSync<typeof import('Application/Env')>('Application/Env').logger.warn = __originWarn;
    });

    beforeEach(() => {
        jest.useFakeTimers({
            now: new Date('2024-12-13T10:40:00.123Z'),
        });
        consoleWarns = [];
    });

    describe('meta информация', () => {
        it('meta всегда определена', () => {
            expect(new DispatchesStorage().getMeta()).toBeDefined();

            const storage1 = new DispatchesStorage();

            storage1.push(ABSTRACT_ACTION);
            expect(storage1.getMeta()).toBeDefined();

            const storage2 = new DispatchesStorage();
            storage2.push(ABSTRACT_ACTION);
            storage2.pop();
            expect(storage2.getMeta()).toBeDefined();
        });

        it('meta информация при начале и завершении операции', () => {
            const storage = new DispatchesStorage();
            storage.push(ABSTRACT_ACTION);
            expect(storage.getMeta().length).toBe(1);
            expect(storage.getMeta()[0].action).toBe(ABSTRACT_ACTION);

            storage.pop();
            // Не теряем мету о распространении после его завершении
            expect(storage.getMeta().length).toBe(1);
            expect(storage.getMeta()[0].action).toBe(ABSTRACT_ACTION);
        });

        it('Название фазы есть в meta информации', () => {
            const PHASE_ID = 'TestPhase';
            const storage = new DispatchesStorage();

            storage.push(ABSTRACT_ACTION, PHASE_ID);
            storage.pop();
            expect(storage.getMeta()[0].phaseId).toBe(PHASE_ID);
        });

        describe('Название фазы ребенка берется с родителя, если не передано в параметрах', () => {
            const PHASE_ID = 'TestPhase';

            const CHILD_1 = { ...ABSTRACT_ACTION };
            const CHILD_2 = { ...ABSTRACT_ACTION };

            it('Задано только на родителе', () => {
                const storage = new DispatchesStorage();

                storage.push(ABSTRACT_ACTION, PHASE_ID);
                storage.push(CHILD_1);
                storage.push(CHILD_2);
                storage.pop();
                storage.pop();
                storage.pop();

                expect(storage.getMeta()[0].phaseId).toBe(PHASE_ID);
                expect(storage.getMeta()[0].children[0].phaseId).toBe(PHASE_ID);
                expect(storage.getMeta()[0].children[0].children[0].phaseId).toBe(PHASE_ID);

                expect(consoleWarns.length).toBe(0);
            });

            it('Перебито на ребенке', () => {
                expect(() => {
                    const storage = new DispatchesStorage();

                    storage.push(ABSTRACT_ACTION, PHASE_ID);
                    storage.push(CHILD_1);
                    storage.push(CHILD_2);
                    storage.pop();
                    storage.pop();
                    storage.pop();

                    expect(storage.getMeta()[0].phaseId).toBe(PHASE_ID);
                    expect(storage.getMeta()[0].children[0].phaseId).toBe(PHASE_ID);
                    expect(storage.getMeta()[0].children[0].children[0].phaseId).toBe(PHASE_ID);
                }).not.toThrow();
            });

            it('Задано только на ребенке, затем попытка перебить', () => {
                const storage = new DispatchesStorage();

                storage.push(ABSTRACT_ACTION);
                storage.push(CHILD_1, PHASE_ID);

                expect(consoleWarns.length).toBe(0);
                storage.push(CHILD_2, 'Phase1244');
                expect(consoleWarns.length).toBe(1);

                storage.pop();
                storage.pop();
                storage.pop();

                expect(storage.getMeta()[0].phaseId).toBeUndefined();
                expect(storage.getMeta()[0].children[0].phaseId).toBe(PHASE_ID);
                expect(storage.getMeta()[0].children[0].children[0].phaseId).toBe(PHASE_ID);

                expect(consoleWarns.length).toBe(1);
                expect(consoleWarns[0]).toBe(
                    'Фаза данного распространения отличается от фазы родителя.\n' +
                        'Это неверная конфигурация, т.к. фаза ждет распространения, а распространение - детей.\n' +
                        'Поэтому вложенное распространение ВСЕГДА принадлежит той же фазе, что и родитель.\n'
                );
            });
        });
    });

    describe('Текущее распространение', () => {
        it('Возвращает распространение, если оно запущено', () => {
            const storage = new DispatchesStorage();
            storage.push(ABSTRACT_ACTION);
            expect(storage.getCurrentDispatch()).toBeDefined();
            expect(storage.getCurrentDispatch()?.getMeta().action).toBe(ABSTRACT_ACTION);
        });
        it('Возвращает undefined, если распространение не запущено', () => {
            const storage = new DispatchesStorage();
            expect(storage.getCurrentDispatch()).toBeUndefined();
        });
        it('После завершения единственного распространения, текущее распространение становится undefined', () => {
            const storage = new DispatchesStorage();
            storage.push(ABSTRACT_ACTION);
            storage.pop();

            expect(storage.getCurrentDispatch()).toBeUndefined();
        });
        it('После завершения дочернего, текущее распространение становится родительским', () => {
            const CHILD_ACTION: TAbstractAction = {
                type: 'CHILD_ACTION',
                payload: {},
            };
            const storage = new DispatchesStorage();
            storage.push(ABSTRACT_ACTION);
            expect(storage.getCurrentDispatch()).toBeDefined();
            expect(storage.getCurrentDispatch()?.getMeta().action).toBe(ABSTRACT_ACTION);

            storage.push(CHILD_ACTION);
            expect(storage.getCurrentDispatch()).toBeDefined();
            expect(storage.getCurrentDispatch()?.getMeta().action).toBe(CHILD_ACTION);

            storage.pop();
            expect(storage.getCurrentDispatch()).toBeDefined();
            expect(storage.getCurrentDispatch()?.getMeta().action).toBe(ABSTRACT_ACTION);

            storage.pop();
            expect(storage.getCurrentDispatch()).toBeUndefined();
        });
    });

    describe('Иерархия', () => {
        const CHILD_ACTION: TAbstractAction = {
            type: 'CHILD_ACTION',
            payload: {},
        };
        it(
            'Родительское распространение - это корневое распространение.' +
                'Дочернее распространение будет записано в родительское распространение',
            () => {
                const storage = new DispatchesStorage();
                storage.push(ABSTRACT_ACTION);
                storage.push(CHILD_ACTION);
                storage.pop();
                storage.pop();

                expect(storage.getMeta().length).toBe(1);
                expect(storage.getMeta()[0].action).toBe(ABSTRACT_ACTION);
                expect(storage.getMeta()[0].children[0].action).toBe(CHILD_ACTION);
            }
        );
    });
});
