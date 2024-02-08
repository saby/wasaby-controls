import CalculatorWithoutVirtualization from 'Controls/_baseList/Controllers/ScrollController/Calculator/CalculatorWithoutVirtualization';

describe('Controls/_baseList/Controllers/CalculatorWithoutVirtualization', () => {
    let calculator: CalculatorWithoutVirtualization;

    beforeEach(() => {
        calculator = new CalculatorWithoutVirtualization({
            totalCount: 10,
            viewportSize: 300,
            contentSize: 500,
            scrollPosition: 0,
            itemsSizes: [
                { size: 50, offset: 0, key: '1' },
                { size: 50, offset: 50, key: '2' },
                { size: 50, offset: 100, key: '3' },
                { size: 50, offset: 150, key: '4' },
                { size: 50, offset: 200, key: '5' },
                { size: 50, offset: 250, key: '6' },
                { size: 50, offset: 300, key: '7' },
                { size: 50, offset: 350, key: '8' },
                { size: 50, offset: 400, key: '9' },
                { size: 50, offset: 450, key: '10' },
            ],
            feature1183225611: false,
        });
        calculator.resetItems(10, { startIndex: 0, endIndex: null });
    });

    describe('addItems', () => {
        it('should calculate range after add items to start', () => {
            const result = calculator.addItems(0, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 15 },
                shiftDirection: 'backward',
                restoreDirection: 'backward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after add items to middle', () => {
            const result = calculator.addItems(5, 1, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 11 },
                shiftDirection: 'forward',
                restoreDirection: 'forward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after add items to end', () => {
            const result = calculator.addItems(10, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 15 },
                shiftDirection: 'forward',
                restoreDirection: 'forward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });
    });

    describe('removeItems', () => {
        it('should calculate range after remove items from start', () => {
            const result = calculator.removeItems(0, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'backward',
                restoreDirection: 'backward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after remove items from middle', () => {
            const result = calculator.removeItems(5, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'forward',
                restoreDirection: 'forward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after remove items from end', () => {
            const result = calculator.removeItems(9, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'forward',
                restoreDirection: 'forward',
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });
    });

    describe('resetItems', () => {
        it('should calculate range', () => {
            const result = calculator.resetItems(20, {
                startIndex: 0,
                endIndex: null,
            });

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 20 },
                shiftDirection: null,
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range regardless of passed startIndex', () => {
            const result = calculator.resetItems(20, {
                startIndex: 5,
                endIndex: null,
            });

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 20 },
                shiftDirection: null,
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });
    });
});
