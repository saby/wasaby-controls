import { SliceUpdate } from 'Controls-DataEnv/newLists/_listDebug/debugger/SliceUpdate';

describe('Controls-DataEnv/newLists/_listDebug/debugger/SliceUpdate', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            now: new Date('2024-12-13T10:40:00.123Z'),
        });
    });

    it('meta всегда определена', () => {
        expect(new SliceUpdate().getMeta()).toBeDefined();

        const upd1 = new SliceUpdate();
        upd1.start();
        expect(upd1.getMeta()).toBeDefined();

        const upd2 = new SliceUpdate();
        upd2.start();
        upd2.end();
        expect(upd2.getMeta()).toBeDefined();
    });

    describe('Время выполнения', () => {
        it('Время обновления неизвестно до его завершения', () => {
            const upd = new SliceUpdate();
            expect(upd.getMeta().duration).toBeUndefined();
            upd.start();
            expect(upd.getMeta().duration).toBeUndefined();
            upd.end();
            expect(upd.getMeta().duration).toBe(0);
        });

        it('Простой до начала обновления и после завершения не влияет на время выполнения', () => {
            const upd = new SliceUpdate();

            jest.advanceTimersByTime(110);

            upd.start();
            jest.advanceTimersByTime(7);
            upd.end();

            jest.advanceTimersByTime(136);

            expect(upd.getMeta().duration).toBe(7);
        });
    });
});
