import { RenderUtils } from 'Controls-Lists/dynamicGrid';

describe('Controls-ListsUnit/DynamicGrid/render/utils', () => {
    describe('getPositionInPeriod', () => {
        const date = new Date(2023, 5, 15, 12, 0, 0, 0);

        test('hour', () => {
            const expectedResult = 0;
            const result = RenderUtils.getPositionInPeriod(date, 'hour');

            expect(result).toEqual(expectedResult);
        });

        test('day', () => {
            const expectedResult = 0.5;
            const result = RenderUtils.getPositionInPeriod(date, 'day');

            expect(result).toEqual(expectedResult);
        });

        test('month', () => {
            const expectedResult = 0.5;
            const result = RenderUtils.getPositionInPeriod(date, 'month');

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getStartDate', () => {
        const date = new Date(2023, 5, 15, 12, 10, 10, 10);

        test('hour', () => {
            const expectedResult = new Date(2023, 5, 15, 12, 0, 0, 0);
            const result = RenderUtils.getStartDate(date, 'hour');

            expect(result).toEqual(expectedResult);
        });

        test('day', () => {
            const expectedResult = new Date(2023, 5, 15, 0, 0, 0, 0);
            const result = RenderUtils.getStartDate(date, 'day');

            expect(result).toEqual(expectedResult);
        });

        test('month', () => {
            const expectedResult = new Date(2023, 5, 1, 0, 0, 0, 0);
            const result = RenderUtils.getStartDate(date, 'month');

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getEndDate', () => {
        const date = new Date(2023, 5, 15, 12, 0, 0, 0);

        test('hour', () => {
            const expectedResult = new Date(2023, 5, 15, 12, 59, 59, 999);
            const result = RenderUtils.getEndDate(date, 'hour');

            expect(result).toEqual(expectedResult);
        });

        test('day', () => {
            const expectedResult = new Date(2023, 5, 15, 23, 59, 59, 999);
            const result = RenderUtils.getEndDate(date, 'day');

            expect(result).toEqual(expectedResult);
        });

        test('month', () => {
            const expectedResult = new Date(2023, 5, 30, 23, 59, 59, 999);
            const result = RenderUtils.getEndDate(date, 'month');

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getInitialColumnsScrollPosition', () => {
        test('base', () => {
            const columnWidth = 50;
            const columnsCount = 15;
            const columnsSpacing = 'xs';

            const expectedResult = 275;

            const result = RenderUtils.getInitialColumnsScrollPosition(
                columnWidth,
                columnsCount,
                columnsSpacing
            );

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getDataQa', () => {
        test('string', () => {
            const element = 'cell';
            const data = '11,12';

            const expectedResult = 'cell_11,12';

            const result = RenderUtils.getDataQa(element, data);

            expect(result).toEqual(expectedResult);
        });

        test('date', () => {
            const element = 'cell';
            const data = new Date(2023, 5, 15, 12, 0, 0, 0);

            const expectedResult = 'cell_2023-06-15 12:00';

            const result = RenderUtils.getDataQa(element, data);

            expect(result).toEqual(expectedResult);
        });
    });
});
