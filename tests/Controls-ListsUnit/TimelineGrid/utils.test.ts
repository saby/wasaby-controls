import { Utils, IRange, Quantum } from 'Controls-Lists/timelineGrid';

describe('Controls-ListsUnit/TimelineGrid/utils', () => {
    describe('getQuantum', () => {
        test('hour', () => {
            const expectedResult = 'hour';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 15, 23, 0, 0, 0),
            };

            const result = Utils.getQuantum(range);
            expect(result).toEqual(expectedResult);
        });

        test('day, one week', () => {
            const expectedResult = 'day';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 21, 23, 0, 0, 0),
            };

            const result = Utils.getQuantum(range);
            expect(result).toEqual(expectedResult);
        });

        test('day, 62 days', () => {
            const expectedResult = 'month';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 7, 16, 23, 0, 0, 0),
            };

            const result = Utils.getQuantum(range);
            expect(result).toEqual(expectedResult);
        });

        test('month, > 62 days', () => {
            const expectedResult = 'month';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 7, 17, 23, 0, 0, 0),
            };

            const result = Utils.getQuantum(range);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getEventsSaturation', () => {
        test('max, 1 day', () => {
            const expectedResult = 'max';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 15, 23, 0, 0, 0),
            };

            const result = Utils.getEventsSaturation(range);
            expect(result).toEqual(expectedResult);
        });

        test('max, 2 weeks', () => {
            const expectedResult = 'max';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 27, 23, 0, 0, 0),
            };

            const result = Utils.getEventsSaturation(range);
            expect(result).toEqual(expectedResult);
        });

        test('mid, > 2 weeks', () => {
            const expectedResult = 'mid';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 28, 23, 0, 0, 0),
            };

            const result = Utils.getEventsSaturation(range);
            expect(result).toEqual(expectedResult);
        });

        test('min, > 62 days', () => {
            const expectedResult = 'min';
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 7, 17, 23, 0, 0, 0),
            };

            const result = Utils.getEventsSaturation(range);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('shiftDate', () => {
        test('hour, forward', () => {
            const expectedResult = new Date(2023, 5, 15, 13, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'forward';
            const quantum = Quantum.Hour;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });

        test('hour, backward', () => {
            const expectedResult = new Date(2023, 5, 15, 11, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'backward';
            const quantum = Quantum.Hour;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });

        test('day, forward', () => {
            const expectedResult = new Date(2023, 5, 16, 12, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'forward';
            const quantum = Quantum.Day;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });

        test('day, backward', () => {
            const expectedResult = new Date(2023, 5, 14, 12, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'backward';
            const quantum = Quantum.Day;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });

        test('month, forward', () => {
            const expectedResult = new Date(2023, 6, 15, 12, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'forward';
            const quantum = Quantum.Month;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });

        test('month, backward', () => {
            const expectedResult = new Date(2023, 4, 15, 12, 0, 0, 0);

            const date = new Date(2023, 5, 15, 12, 0, 0, 0);
            const direction = 'backward';
            const quantum = Quantum.Month;
            const shiftFactor = 1;

            Utils.shiftDate(date, direction, quantum, shiftFactor);
            expect(date).toEqual(expectedResult);
        });
    });
});
