import { Dispatch } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/Dispatch';
import {
    ChangeType,
    TChange,
} from 'Controls-DataEnv/newLists/_listDebug/debugger/session/ChangesStorage';
import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import * as ErrorDescriptors from 'Controls-DataEnv/newLists/_listDebug/ErrorDescriptors';

describe('Controls-DataEnv/newLists/_listDebug/debugger/session/Dispatch', () => {
    const ABSTRACT_ACTION: TAbstractAction = {
        type: '',
        payload: {},
    };

    beforeEach(() => {
        jest.useFakeTimers({
            now: new Date('2024-12-13T10:40:00.123Z'),
        });
    });

    describe('Контроль начала и завершения, корректность состояний (автомат)', () => {
        it('Правильная последовательность', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.start(ABSTRACT_ACTION);
                dispatch.end();
            }).not.toThrow();
        });

        it('Нельзя повторно начать распространение', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.start(ABSTRACT_ACTION);
                dispatch.start(ABSTRACT_ACTION);
            }).toThrow(ErrorDescriptors.DISPATCH_ALREADY_EXISTS());
        });

        it('Можно начать не начатое распространение', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.start(ABSTRACT_ACTION);
            }).not.toThrow();
        });

        it('Можно начать завершенное распространение (не начаое распространение = завершенное)', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.start(ABSTRACT_ACTION);
                dispatch.end();
                dispatch.start(ABSTRACT_ACTION);
            }).not.toThrow();
        });

        it('Нельзя завершить не начатое', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.end();
            }).toThrow(ErrorDescriptors.MISSING_DISPATCH());
        });

        it('Нельзя завершить завершенное', () => {
            expect(() => {
                const dispatch = new Dispatch();
                dispatch.start(ABSTRACT_ACTION);
                dispatch.end();
                dispatch.end();
            }).toThrow(ErrorDescriptors.MISSING_DISPATCH());
        });
    });

    describe('meta информация', () => {
        it('meta всегда определена', () => {
            expect(new Dispatch().getMeta()).toBeDefined();

            const dispatch1 = new Dispatch();

            dispatch1.start(ABSTRACT_ACTION);
            expect(dispatch1.getMeta()).toBeDefined();

            const dispatch2 = new Dispatch();
            dispatch2.start(ABSTRACT_ACTION);
            dispatch2.end();
            expect(dispatch2.getMeta()).toBeDefined();
        });

        it('meta информация при начале операции', () => {
            const dispatch = new Dispatch();
            dispatch.start(ABSTRACT_ACTION);
            expect(dispatch.getMeta().action).toBe(ABSTRACT_ACTION);

            dispatch.end();
            expect(dispatch.getMeta().action).toBe(ABSTRACT_ACTION);
        });

        it('meta информация сбрасывается при рестарте распространения', () => {
            const dispatch = new Dispatch();
            dispatch.start(ABSTRACT_ACTION);
            dispatch.end();

            const ABSTRACT_ACTION_2: TAbstractAction = {
                type: 'ABSTRACT_ACTION_2',
                payload: {},
            };

            dispatch.start(ABSTRACT_ACTION_2);
            expect(dispatch.getMeta().action).toBe(ABSTRACT_ACTION_2);

            dispatch.end();
            expect(dispatch.getMeta().action).toBe(ABSTRACT_ACTION_2);
        });

        it('Название фазы есть в meta информации', () => {
            const PHASE_ID = 'TestPhase';
            const dispatch = new Dispatch(undefined, PHASE_ID);

            expect(dispatch.getMeta().phaseId).toBe(PHASE_ID);
            dispatch.start(ABSTRACT_ACTION);
            expect(dispatch.getMeta().phaseId).toBe(PHASE_ID);
            dispatch.end();
            expect(dispatch.getMeta().phaseId).toBe(PHASE_ID);
        });
    });

    describe('Время выполнения', () => {
        it('Время обновления неизвестно до его завершения', () => {
            const dispatch = new Dispatch();
            expect(dispatch.getMeta().duration).toBeUndefined();
            dispatch.start(ABSTRACT_ACTION);
            expect(dispatch.getMeta().duration).toBeUndefined();
            dispatch.end();
            expect(dispatch.getMeta().duration).toBe(0);
        });

        it('Простой до начала обновления и после завершения не влияет на время выполнения', () => {
            const dispatch = new Dispatch();

            jest.advanceTimersByTime(110);

            dispatch.start(ABSTRACT_ACTION);
            jest.advanceTimersByTime(7);
            dispatch.end();

            jest.advanceTimersByTime(136);

            expect(dispatch.getMeta().duration).toBe(7);
        });
    });

    describe('Иерархия распространений', () => {
        it('Распространения поддерживают иерархию при создании', () => {
            const parent = new Dispatch();
            const child = new Dispatch(parent);

            expect(child.getParent()).toBe(parent);
            expect(parent.getChildren().length).toBe(1);
            expect(parent.getChildren()[0]).toBe(child);

            const child2 = new Dispatch(parent);
            expect(child.getParent()).toBe(parent);

            expect(parent.getChildren().length).toBe(2);
            expect(parent.getChildren()[0]).toBe(child);
            expect(parent.getChildren()[1]).toBe(child2);
        });

        describe('Разрыв иерархии при разрушении', () => {
            it('Разрушился родитель', () => {
                const parent = new Dispatch();
                const child = new Dispatch(parent);

                parent.destroy();

                expect(child.getParent()).toBeUndefined();
                expect(parent.getChildren().length).toBe(0);
            });

            it('Разрушился единственный ребенок', () => {
                const parent = new Dispatch();
                const child = new Dispatch(parent);

                child.destroy();

                expect(child.getParent()).toBeUndefined();

                // Не удаляемся из родителя, он по нам соберет мету
                expect(parent.getChildren().length).toBe(1);
            });

            it('Разрушился один из детей', () => {
                const parent = new Dispatch();
                const child1 = new Dispatch(parent);
                const child2 = new Dispatch(parent);

                child1.destroy();

                expect(child1.getParent()).toBeUndefined();
                expect(child2.getParent()).toBe(parent);
                expect(parent.getChildren().length).toBe(2);
            });
        });
    });

    describe('Привязка изменения к распространению', () => {
        it('Нельзя привязать к незапущенному распространению', () => {
            const change: TChange = {
                type: ChangeType.Inner,
                key: 'count',
                prev: 1,
                next: 2,
                isEqualRef: false,
                isEqualValue: false,
            };
            const dispatch = new Dispatch();

            expect(() => {
                dispatch.addChange(change);
            }).toThrow(ErrorDescriptors.MISSING_DISPATCH());
        });

        it('Нельзя привязать к завершенному распространению', () => {
            const change: TChange = {
                type: ChangeType.Inner,
                key: 'count',
                prev: 1,
                next: 2,
                isEqualRef: false,
                isEqualValue: false,
            };
            const dispatch = new Dispatch();
            dispatch.start(ABSTRACT_ACTION);
            dispatch.end();

            expect(() => {
                dispatch.addChange(change);
            }).toThrow(ErrorDescriptors.MISSING_DISPATCH());
        });

        it('Корректная привязка', () => {
            const change: TChange = {
                type: ChangeType.Inner,
                key: 'count',
                prev: 1,
                next: 2,
                isEqualRef: false,
                isEqualValue: false,
            };
            const dispatch = new Dispatch();
            dispatch.start(ABSTRACT_ACTION);

            expect(() => {
                dispatch.addChange(change);
            }).not.toThrow();

            expect(dispatch.getMeta().changes.length).toBe(1);
            expect(dispatch.getMeta().changes[0]).toBe(change);
            expect(change.initiator).toBe(dispatch);

            dispatch.end();
            expect(change.initiator).toBe(dispatch);
        });
    });
});
