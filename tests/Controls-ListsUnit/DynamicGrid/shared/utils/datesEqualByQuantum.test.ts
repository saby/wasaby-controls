import { SharedUtils } from 'Controls-Lists/dynamicGrid';

describe('Controls-ListsUnit/DynamicGrid/shared/utils/datesEqualByQuantum', () => {
    const mainDate = new Date(2023, 5, 15, 12, 0, 0, 0);
    const fullEqualDate = new Date(2023, 5, 15, 12, 0, 0, 0);
    const yearEqualDate = new Date(2023, 4, 14, 11, 10, 10, 10);
    const monthEqualDate = new Date(2023, 5, 14, 11, 10, 10, 10);
    const dayEqualDate = new Date(2023, 5, 15, 11, 10, 10, 10);
    const hourEqualDate = new Date(2023, 5, 15, 12, 10, 10, 10);

    test('hour', () => {
        const quantum = 'hour';
        expect(SharedUtils.datesEqualByQuantum(mainDate, fullEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, yearEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, monthEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, dayEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, hourEqualDate, quantum)).toBeTruthy();
    });

    test('day', () => {
        const quantum = 'day';
        expect(SharedUtils.datesEqualByQuantum(mainDate, fullEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, yearEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, monthEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, dayEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, hourEqualDate, quantum)).toBeTruthy();
    });

    test('month', () => {
        const quantum = 'month';
        expect(SharedUtils.datesEqualByQuantum(mainDate, fullEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, yearEqualDate, quantum)).toBeFalsy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, monthEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, dayEqualDate, quantum)).toBeTruthy();
        expect(SharedUtils.datesEqualByQuantum(mainDate, hourEqualDate, quantum)).toBeTruthy();
    });
});
