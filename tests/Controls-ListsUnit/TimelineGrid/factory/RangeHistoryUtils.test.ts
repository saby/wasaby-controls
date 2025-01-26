import { RangeHistoryUtils, IRange } from 'Controls-Lists/timelineGrid';
import { USER } from 'ParametersWebAPI/Scope';

describe('Controls-ListsUnit/TimelineGrid/factory/RangeHistoryUtils', () => {
    const range: IRange = {
        start: new Date(2023, 5, 15, 0, 0, 0, 0),
        end: new Date(2023, 5, 21, 0, 0, 0, 0),
    };
    const key = 'timeline_key';

    beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(2020, 11, 8));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test('store', () => {
        const spyOnUserSet = jest.spyOn(USER, 'set');

        const saveData = {
            range,
            saveTime: new Date(),
        };
        const stringifySaveData = JSON.stringify(saveData);

        RangeHistoryUtils.store(key, range);

        expect(spyOnUserSet).toBeCalledTimes(1);
        expect(spyOnUserSet).toHaveBeenCalledWith(key, stringifySaveData);
    });

    test('restore', async () => {
        const restoredRange = await RangeHistoryUtils.restore(key);

        expect(restoredRange).toEqual(range);
    });

    test('restore, expired day', async () => {
        const expectedRange = {
            start: new Date(2020, 11, 15, 0, 0, 0, 0),
            end: new Date(2020, 11, 21, 0, 0, 0, 0),
        };

        jest.setSystemTime(new Date(2020, 11, 15));
        const restoredRange = await RangeHistoryUtils.restore(key);

        expect(restoredRange).toEqual(expectedRange);
    });
});
