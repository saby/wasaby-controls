import {
    AbstractPhase,
    IPhaseMeta,
} from 'Controls-DataEnv/newLists/_listDebug/debugger/session/phases';

type TBeforeMeta = { beforeValue: string };
type TAfterMeta = { afterValue: string };

class AnyPhase extends AbstractPhase<IPhaseMeta<TBeforeMeta, TAfterMeta>> {
    id: string = 'AnyPhase';
    readonly description: string = '';
}

describe('Controls-DataEnv/newLists/_listDebug/debugger/session/phases', () => {
    const BEFORE_META: TBeforeMeta = { beforeValue: '123' };
    const AFTER_META: TAfterMeta = { afterValue: '456' };

    beforeEach(() => {
        jest.useFakeTimers({
            now: new Date('2024-12-13T10:40:00.123Z'),
        });
    });

    describe('Контроль начала и завершения, корректность состояний (автомат)', () => {
        it('Правильная последовательность', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.start(BEFORE_META);
                phase.end(AFTER_META);
            }).not.toThrow();
        });

        it('Нельзя повторно начать фазу', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.start(BEFORE_META);
                phase.start(BEFORE_META);
            }).toThrow(
                'ОШИБКА СИСТЕМЫ ОТЛАДКИ ИНТЕРАКТОРА СПИСКА.\n' + 'Фаза [AnyPhase] УЖЕ запущена!'
            );
        });

        it('Можно начать не начатую фазу', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.start(BEFORE_META);
            }).not.toThrow();
        });

        it('Можно начать завершенную фазу (не начатая фаза = завершенная)', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.start(BEFORE_META);
                phase.end(AFTER_META);
                phase.start(BEFORE_META);
            }).not.toThrow();
        });

        it('Нельзя завершить не начатое', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.end(AFTER_META);
            }).toThrow(
                'ОШИБКА СИСТЕМЫ ОТЛАДКИ ИНТЕРАКТОРА СПИСКА.\n' + 'Фаза [AnyPhase] НЕ запущена!'
            );
        });
        it('Нельзя завершить завершенное', () => {
            expect(() => {
                const phase = new AnyPhase();
                phase.start(BEFORE_META);
                phase.end(AFTER_META);
                phase.end(AFTER_META);
            }).toThrow(
                'ОШИБКА СИСТЕМЫ ОТЛАДКИ ИНТЕРАКТОРА СПИСКА.\n' + 'Фаза [AnyPhase] НЕ запущена!'
            );
        });
    });

    describe('meta информация', () => {
        it('meta всегда определена', () => {
            expect(new AnyPhase().getMeta()).toBeDefined();

            const phase1 = new AnyPhase();

            phase1.start(BEFORE_META);
            expect(phase1.getMeta()).toBeDefined();

            const phase2 = new AnyPhase();
            phase2.start(BEFORE_META);
            phase2.end(AFTER_META);
            expect(phase2.getMeta()).toBeDefined();
        });

        it('meta информация при начале и завершении операции', () => {
            const phase = new AnyPhase();
            phase.start(BEFORE_META);
            expect(phase.getMeta().beforeMeta).toBe(BEFORE_META);
            expect(phase.getMeta().afterMeta).toBeUndefined();

            phase.end(AFTER_META);
            expect(phase.getMeta().beforeMeta).toBe(BEFORE_META);
            expect(phase.getMeta().afterMeta).toBe(AFTER_META);
        });

        it('meta информация сбрасывается при рестарте фазы', () => {
            const phase = new AnyPhase();
            phase.start(BEFORE_META);
            phase.end(AFTER_META);

            const BEFORE_META_2: TBeforeMeta = {
                beforeValue: 'BEFORE_META_2',
            };

            const AFTER_META_2: TAfterMeta = {
                afterValue: 'AFTER_META_2',
            };

            phase.start(BEFORE_META_2);
            expect(phase.getMeta().beforeMeta).toBe(BEFORE_META_2);
            expect(phase.getMeta().afterMeta).toBeUndefined();

            phase.end(AFTER_META_2);
            expect(phase.getMeta().beforeMeta).toBe(BEFORE_META_2);
            expect(phase.getMeta().afterMeta).toBe(AFTER_META_2);
        });
    });

    describe('Время выполнения', () => {
        it('Время выполнения неизвестно до завершения фазы', () => {
            const phase = new AnyPhase();
            expect(phase.getMeta().duration).toBeUndefined();
            phase.start(BEFORE_META);
            expect(phase.getMeta().duration).toBeUndefined();
            phase.end(AFTER_META);
            expect(phase.getMeta().duration).toBe(0);
        });

        it('Простой до начала фазы и после завершения не влияет на время выполнения', () => {
            const phase = new AnyPhase();

            jest.advanceTimersByTime(110);

            phase.start(BEFORE_META);
            jest.advanceTimersByTime(7);
            phase.end(AFTER_META);

            jest.advanceTimersByTime(136);

            expect(phase.getMeta().duration).toBe(7);
        });
    });
});
