import { Calculator, AbstractCalculator, IAbstractCalculatorResult } from 'Controls/baseList';
import { ICalcMode, IItemsRange, IPlaceholders } from 'Controls/baseList';

class TestCalculator extends AbstractCalculator {
    addItems(position: number, count: number, calcMode: ICalcMode): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this._totalCount += count;
        this._range = {
            startIndex: 0,
            endIndex: this._totalCount,
        };
        return this._getRangeChangeResult(oldState, direction);
    }

    removeItems(position: number, count: number): IAbstractCalculatorResult {
        const oldState = this._getOldState();
        const direction = position <= this._range.startIndex ? 'backward' : 'forward';
        this._totalCount -= count;
        this._range = {
            startIndex: 0,
            endIndex: this._totalCount,
        };
        return this._getRangeChangeResult(oldState, direction);
    }

    resetItems(totalCount: number, initRange: IItemsRange): IAbstractCalculatorResult {
        const oldState = this._getOldState();

        this._totalCount = totalCount;
        this._range = {
            startIndex: 0,
            endIndex: totalCount,
        };

        return this._getRangeChangeResult(oldState, null);
    }

    protected _getPlaceholders(): IPlaceholders {
        return { backward: 0, forward: 0 };
    }
}

describe('Controls/baseList:AbstractCalculator', () => {
    let calculator: TestCalculator;

    beforeEach(() => {
        calculator = new TestCalculator({
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

    describe('getRange', () => {
        it('should return current range', () => {
            expect(calculator.getRange()).toEqual({
                startIndex: 0,
                endIndex: 10,
            });
        });
    });

    describe('getTotalItemsCount', () => {
        it('should return total items count', () => {
            expect(calculator.getTotalItemsCount()).toEqual(10);
        });
    });

    describe('getFirstVisibleItemIndex', () => {
        it('should return first visible item index', () => {
            expect(calculator.getFirstVisibleItemIndex()).toEqual(0);
        });

        it('should return first visible item index after scroll', () => {
            calculator.scrollPositionChange(130, false);

            expect(calculator.getFirstVisibleItemIndex()).toEqual(3);
        });

        it('if two items are not fully visible then should return the last item', () => {
            calculator.resetItems(2, { startIndex: 0, endIndex: null });
            calculator.scrollPositionChange(200, false);
            calculator.updateItemsSizes([
                { size: 50, offset: 0, key: '1' },
                { size: 500, offset: 50, key: '2' },
            ]);

            expect(calculator.getFirstVisibleItemIndex()).toEqual(2);
        });
        it('with stickyContentSize', () => {
            calculator.resetItems(5, { startIndex: 0, endIndex: null });
            calculator.scrollPositionChange(150, false);
            calculator.updateItemsSizes([
                { size: 50, offset: 100, key: '1' },
                { size: 50, offset: 150, key: '2' },
                { size: 50, offset: 200, key: '3' },
                { size: 50, offset: 250, key: '4' },
                { size: 50, offset: 300, key: '5' },
            ]);

            expect(calculator.getFirstVisibleItemIndex(100)).toEqual(3);
        });
    });

    describe('getEdgeVisibleItem', () => {
        it('should return backward edge item', () => {
            calculator.scrollPositionChange(130, false);

            const edgeItem = calculator.getEdgeVisibleItem({
                direction: 'backward',
            });

            expect(edgeItem).toEqual({
                key: '3',
                direction: 'backward',
                borderDistance: 20,
                border: 'forward',
            });
        });

        it('should return forward edge item', () => {
            calculator.scrollPositionChange(130, false);

            const edgeItem = calculator.getEdgeVisibleItem({
                direction: 'forward',
            });

            expect(edgeItem).toEqual({
                key: '9',
                direction: 'forward',
                borderDistance: 30,
                border: 'backward',
            });
        });

        it('should return backward edge item calculated by passed params', () => {
            calculator.scrollPositionChange(130, false);

            const edgeItem = calculator.getEdgeVisibleItem({
                direction: 'backward',
                range: { startIndex: 3, endIndex: 8 },
                placeholders: { backward: 150, forward: 100 },
            });

            expect(edgeItem).toEqual({
                key: '6',
                direction: 'backward',
                borderDistance: 20,
                border: 'forward',
            });
        });

        it('should return forward edge item calculated by passed params', () => {
            calculator.scrollPositionChange(130, false);

            const edgeItem = calculator.getEdgeVisibleItem({
                direction: 'forward',
                range: { startIndex: 3, endIndex: 8 },
                placeholders: { backward: 150, forward: 150 },
            });

            expect(edgeItem).toEqual({
                key: '8',
                direction: 'forward',
                borderDistance: 230,
                border: 'backward',
            });
        });

        it('should return last rendered item if viewport is not full', () => {
            calculator.setViewportSize(1500);

            const edgeItem = calculator.getEdgeVisibleItem({
                range: { startIndex: 0, endIndex: 10 },
                direction: 'forward',
                placeholders: { backward: 0, forward: 0 },
            });

            expect(edgeItem).toEqual({
                key: '10',
                direction: 'forward',
                border: 'backward',
                borderDistance: 1050,
            });
        });

        it('should not throw error if first item is not valid', () => {
            let error;
            let edgeItem;
            const calculator = new TestCalculator({
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
                validateItemCallback: (key) => {
                    return key !== '1';
                },
            });
            calculator.resetItems(10, { startIndex: 0, endIndex: null });
            calculator.updateItemsSizes([{ size: 50, offset: 0, key: '1' }], false);

            try {
                edgeItem = calculator.getEdgeVisibleItem({
                    direction: 'backward',
                });
            } catch (e) {
                error = e;
            }

            expect(error).toBeFalsy();
            expect(edgeItem).toBeNull();
        });
    });

    describe('getScrollPositionToEdgeItem', () => {
        it('should return current scroll position if the backward edge item is not found', () => {
            calculator.scrollPositionChange(100, false);

            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '99999',
                border: 'backward',
                borderDistance: 30,
                direction: 'backward',
            });

            expect(scrollPosition).toEqual(100);
        });

        it('should return current scroll position if the forward edge item is not found', () => {
            calculator.scrollPositionChange(100, false);

            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '99999',
                border: 'backward',
                borderDistance: 30,
                direction: 'forward',
            });

            expect(scrollPosition).toEqual(100);
        });

        it('should calculate new scroll position for backward edge item with backward border', () => {
            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '4',
                border: 'backward',
                borderDistance: 30,
                direction: 'backward',
            });

            expect(scrollPosition).toEqual(180);
        });

        it('should calculate new scroll position for backward edge item with forward border', () => {
            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '4',
                border: 'forward',
                borderDistance: 30,
                direction: 'backward',
            });

            expect(scrollPosition).toEqual(170);
        });

        it('should calculate new scroll position for forward edge item with backward border', () => {
            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '9',
                border: 'backward',
                borderDistance: 30,
                direction: 'forward',
            });

            expect(scrollPosition).toEqual(130);
        });

        it('should not return negative position', () => {
            const scrollPosition = calculator.getScrollPositionToEdgeItem({
                key: '0',
                border: 'backward',
                borderDistance: 30,
                direction: 'forward',
            });

            expect(scrollPosition).toEqual(0);
        });
    });

    describe('scrollPositionChange', () => {
        it('should calculate active element if scroll position is not changed', () => {
            const result = calculator.scrollPositionChange(0, true);

            // После виртуального скролла scrollPosition может остаться прежним,
            // но активный элемент пересчитать все еще нужно
            expect(result).toEqual({
                activeElementIndex: 0,
                activeElementIndexChanged: true,
            });
        });

        it('should calculate active element', () => {
            const result = calculator.scrollPositionChange(130, true);

            expect(result).toEqual({
                activeElementIndex: 6,
                activeElementIndexChanged: true,
            });
        });

        it('should calculate active element for new viewport size', () => {
            calculator.setViewportSize(200);

            const result = calculator.scrollPositionChange(130, true);

            expect(result).toEqual({
                activeElementIndex: 4,
                activeElementIndexChanged: true,
            });
        });

        it('should calculate active element for new list container size', () => {
            calculator.setListContainerSize(600);

            const result = calculator.scrollPositionChange(130, true);

            expect(result).toEqual({
                activeElementIndex: 5,
                activeElementIndexChanged: true,
            });
        });

        it('should not calculate active element if param updateActiveElement=false', () => {
            const result = calculator.scrollPositionChange(130, false);

            expect(result).toEqual({
                activeElementIndex: undefined,
                activeElementIndexChanged: false,
            });
        });

        it('should correct scroll position if position is negative', () => {
            const result = calculator.scrollPositionChange(-20, true);

            expect(result).toEqual({
                activeElementIndex: 0,
                activeElementIndexChanged: true,
            });
        });

        it('should correct scroll position if position is higher than max value', () => {
            const result = calculator.scrollPositionChange(2000, true);

            expect(result).toEqual({
                activeElementIndex: 9,
                activeElementIndexChanged: true,
            });
        });

        it("should not calculate active element if items don't exist", () => {
            calculator.resetItems(0, { startIndex: 0, endIndex: null });

            const result = calculator.scrollPositionChange(130, true);

            expect(result).toEqual({
                activeElementIndex: undefined,
                activeElementIndexChanged: false,
            });
        });

        it('should calculate active element if feature1183225611 = true', () => {
            const calculator = new Calculator({
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
                virtualScrollConfig: {
                    pageSize: 10,
                },
                feature1183225611: true,
                triggersOffsets: { backward: 0, forward: 0 },
                givenItemsSizes: null,
            });
            calculator.resetItems(10, { startIndex: 0, endIndex: null });

            const result = calculator.scrollPositionChange(130, true);

            expect(result).toEqual({
                activeElementIndex: 2,
                activeElementIndexChanged: true,
            });
        });
    });

    describe('addItems', () => {
        it('should calculate range after adding items to the start', () => {
            calculator.updateItemsSizes(
                [
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
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
                true
            );

            const result = calculator.addItems(0, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 15 },
                shiftDirection: 'backward',
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
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
                },
                scrollMode: null,
            });
        });

        it('should calculate range after adding items to the middle', () => {
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0, key: '1' },
                    { size: 50, offset: 50, key: '2' },
                    { size: 50, offset: 100, key: '3' },
                    { size: 50, offset: 150, key: '4' },
                    { size: 50, offset: 200, key: '5' },
                    { size: 50, offset: 250, key: '6' },
                    { size: 0, offset: 0 },
                    { size: 50, offset: 300, key: '7' },
                    { size: 50, offset: 350, key: '8' },
                    { size: 50, offset: 400, key: '9' },
                    { size: 50, offset: 450, key: '10' },
                ],
                true
            );

            const result = calculator.addItems(5, 1, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 11 },
                shiftDirection: 'forward',
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
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
                },
                scrollMode: null,
            });
        });

        it('should calculate range after adding items to the end', () => {
            calculator.updateItemsSizes(
                [
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
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                true
            );

            const result = calculator.addItems(10, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 15 },
                shiftDirection: 'forward',
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
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
                },
                scrollMode: null,
            });
        });
    });

    describe('removeItems', () => {
        it('should calculate range after removing items from the start', () => {
            const result = calculator.removeItems(0, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'backward',
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after removing items from the middle', () => {
            const result = calculator.removeItems(5, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'forward',
                restoreDirection: null,
                indexesChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after removing items from the end', () => {
            const result = calculator.removeItems(9, 1);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 9 },
                shiftDirection: 'forward',
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

    describe('resetItems', () => {
        it('should calculate new range', () => {
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
    });
});
