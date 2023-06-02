import { Calculator } from 'Controls/_baseList/Controllers/ScrollController/Calculator/Calculator';

describe('Controls/_baseList/Controllers/ScrollController/Calculator/Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator({
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
            feature1183225611: false,
            triggersOffsets: { backward: 0, forward: 0 },
            givenItemsSizes: null,
        });
        calculator.resetItems(10, { startIndex: 0, endIndex: null });
    });

    describe('getFirstVisibleItemIndex', () => {
        it('should calculate first visible item index given the backward placeholder', () => {
            calculator.scrollPositionChange(200, false);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                true
            );
            calculator.addItems(10, 5, 'shift');

            calculator.scrollPositionChange(50, false);

            expect(calculator.getFirstVisibleItemIndex()).toEqual(4);
        });
    });

    describe('hasItemsOutsideOfRange', () => {
        it('should not have items outside of range', () => {
            expect(calculator.hasItemsOutsideOfRange('backward')).toBe(false);
            expect(calculator.hasItemsOutsideOfRange('forward')).toBe(false);
        });

        it('should have items outside of range: forward', () => {
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
            calculator.addItems(10, 5, 'shift');

            expect(calculator.hasItemsOutsideOfRange('backward')).toBe(false);
            expect(calculator.hasItemsOutsideOfRange('forward')).toBe(true);
        });

        it('should have items outside of range: backward', () => {
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
            calculator.addItems(0, 5, 'shift');
            calculator.shiftRangeToDirection('forward');

            expect(calculator.hasItemsOutsideOfRange('backward')).toBe(true);
            expect(calculator.hasItemsOutsideOfRange('forward')).toBe(false);
        });

        it('should have items outside of range: backward and forward', () => {
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
            calculator.addItems(0, 5, 'shift');

            expect(calculator.hasItemsOutsideOfRange('forward')).toBe(true);
            expect(calculator.hasItemsOutsideOfRange('backward')).toBe(true);
        });
    });

    describe('setItemsRenderedOutsideRange', () => {
        it("should update placeholders' offsets", () => {
            calculator.scrollPositionChange(200, false);
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.shiftRangeToDirection('forward');
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                true
            );

            const result = calculator.setItemsRenderedOutsideRange([{key: '1', collectionIndex: 0}]);

            expect(result.placeholdersChanged).toBe(true);
            expect(result.placeholders).toEqual({
                backward: 200,
                forward: 0,
            });
        });

        it("should not update placeholders' offsets if items rendered outside range have not changed ", () => {
            calculator.scrollPositionChange(200, false);
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.shiftRangeToDirection('forward');
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                false
            );
            calculator.setItemsRenderedOutsideRange([{key: '1', collectionIndex: 0}]);

            const result = calculator.setItemsRenderedOutsideRange([{key: '1', collectionIndex: 0}]);

            expect(result.placeholdersChanged).toBe(false);
            expect(result.placeholders).toEqual({
                backward: 200,
                forward: 0,
            });
        });
    });

    describe('shiftRangeToDirection', () => {
        it('should not recalculate state if there are no items outside of the range: forward', () => {
            const result = calculator.shiftRangeToDirection('forward');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: 'forward',
                indexesChanged: false,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { forward: 0, backward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should not recalculate state if there are no items outside of the range: backward', () => {
            const result = calculator.shiftRangeToDirection('backward');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: 'backward',
                indexesChanged: false,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { forward: 0, backward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should recalculate state if there are items in the range: forward', () => {
            calculator.scrollPositionChange(200, false);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                true
            );
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 50, offset: 500 },
                    { size: 50, offset: 550 },
                    { size: 50, offset: 600 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                false
            );
            calculator.scrollPositionChange(300, false);

            const result = calculator.shiftRangeToDirection('forward');

            expect(result).toEqual({
                range: { startIndex: 5, endIndex: 15 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 250,
                    forward: 0,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 3, endIndex: 13 },
                    placeholders: { forward: 0, backward: 150 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('should recalculate state if there are items in the range: backward', () => {
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
            calculator.addItems(0, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.updateItemsSizes(
                [
                    { size: 0, offset: 0, key: '0' },
                    { size: 50, offset: 0, key: '1' },
                    { size: 50, offset: 50, key: '2' },
                    { size: 50, offset: 100, key: '3' },
                    { size: 50, offset: 150, key: '4' },
                    { size: 50, offset: 200, key: '5' },
                    { size: 50, offset: 250, key: '6' },
                    { size: 50, offset: 300, key: '7' },
                    { size: 50, offset: 350, key: '8' },
                    { size: 50, offset: 400, key: '9' },
                    { size: 50, offset: 550, key: '10' },
                    { size: 50, offset: 600, key: '11' },
                    { size: 50, offset: 650, key: '12' },
                    { size: 50, offset: 700, key: '13' },
                    { size: 50, offset: 750, key: '14' },
                ],
                false
            );
            // якобы восстановился скролл
            calculator.scrollPositionChange(150, false);
            // проскроллили
            calculator.scrollPositionChange(0, false);

            const result = calculator.shiftRangeToDirection('backward');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 250,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 2, endIndex: 12 },
                    placeholders: { backward: 0, forward: 150 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('when shifting the range forward, offsets of triggers should be taken into account', () => {
            calculator.setTriggerOffsets({ backward: 100, forward: 100 });
            calculator.scrollPositionChange(200, false);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                true
            );
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 50, offset: 500 },
                    { size: 50, offset: 550 },
                    { size: 50, offset: 600 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                false
            );
            calculator.scrollPositionChange(300, false);

            const result = calculator.shiftRangeToDirection('forward');

            expect(result).toEqual({
                range: { startIndex: 1, endIndex: 15 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 50,
                    forward: 0,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: true,

                oldState: {
                    range: { startIndex: 0, endIndex: 13 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('when shifting the range backward, offsets of triggers should be taken into account', () => {
            calculator.setTriggerOffsets({ backward: 100, forward: 100 });
            calculator.scrollPositionChange(200, false);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                true
            );
            calculator.addItems(0, 5, 'shift');
            calculator.setListContainerSize(600);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0 },
                    { size: 50, offset: 50 },
                    { size: 50, offset: 100 },
                    { size: 50, offset: 150 },
                    { size: 50, offset: 200 },
                    { size: 50, offset: 250 },
                    { size: 50, offset: 300 },
                    { size: 50, offset: 350 },
                    { size: 50, offset: 400 },
                    { size: 50, offset: 450 },
                    { size: 50, offset: 500 },
                    { size: 50, offset: 550 },
                    { size: 50, offset: 600 },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                false
            );
            calculator.scrollPositionChange(300, false);

            const result = calculator.shiftRangeToDirection('backward');

            expect(result).toEqual({
                range: { startIndex: 2, endIndex: 15 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: { backward: 100, forward: 0 },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: { backward: true, forward: false },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 5, endIndex: 15 },
                    placeholders: { backward: 250, forward: 0 },
                    hasItemsOutsideOfRange: { backward: true, forward: false },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });
    });

    describe('shiftRangeToIndex', () => {
        it('should not recalculate state if the item is inside of the range', () => {
            const result = calculator.shiftRangeToIndex(3);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: null,
                indexesChanged: false,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should recalculate state if the item is outside of the range', () => {
            calculator.scrollPositionChange(200, false);
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
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                false
            );

            const result = calculator.shiftRangeToIndex(14);

            expect(result).toEqual({
                range: { startIndex: 5, endIndex: 15 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 250,
                    forward: 0,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 3, endIndex: 13 },
                    placeholders: { backward: 150, forward: 0 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('should recalculate indexes if there is not enough content to scroll forward', () => {
            calculator.scrollPositionChange(200, false);
            calculator.setViewportSize(400);
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
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(700);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                false
            );

            const result = calculator.shiftRangeToIndex(3, true, 'bottom');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 250,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 3, endIndex: 13 },
                    placeholders: { backward: 150, forward: 0 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('should recalculate indexes if there is not enough content to scroll backward', () => {
            calculator.scrollPositionChange(200, false);
            calculator.setViewportSize(400);
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
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(700);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                false
            );

            const result = calculator.shiftRangeToIndex(13, true, 'top');

            expect(result).toEqual({
                range: { startIndex: 5, endIndex: 15 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 250,
                    forward: 0,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 3, endIndex: 13 },
                    placeholders: { backward: 150, forward: 0 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });

        it('should not recalculate indexes if there is not enough content but item is inside viewport', () => {
            calculator.scrollPositionChange(200, false);
            calculator.setViewportSize(400);
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
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(700);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                false
            );

            const result = calculator.shiftRangeToIndex(7, false, 'bottom');

            expect(result.indexesChanged).toBe(false);
        });
    });

    describe('shiftRangeToVirtualScrollPosition', () => {
        it('should not recalculate indexes if position is not changed', () => {
            const result = calculator.shiftRangeToVirtualScrollPosition(0);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: null,
                indexesChanged: false,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should recalculate indexes if position is changed', () => {
            calculator.scrollPositionChange(200, false);
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
            calculator.addItems(10, 5, 'shift');
            calculator.setListContainerSize(600);
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 0, offset: 0 },
                    { size: 0, offset: 0 },
                ],
                false
            );
            calculator.scrollPositionChange(300, false);
            calculator.shiftRangeToDirection('forward');
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
                    { size: 50, offset: 500, key: '11' },
                    { size: 50, offset: 550, key: '12' },
                    { size: 50, offset: 600, key: '13' },
                    { size: 50, offset: 650, key: '14' },
                    { size: 50, offset: 700, key: '15' },
                ],
                false
            );

            const result = calculator.shiftRangeToVirtualScrollPosition(0);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: null,
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 250,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 5, endIndex: 15 },
                    placeholders: { backward: 250, forward: 0 },
                    hasItemsOutsideOfRange: { backward: true, forward: false },
                    itemsSizes: null,
                },
                scrollMode: null,
            });
        });
    });

    describe('addItems', () => {
        it('should calculate range after adding items to the start', () => {
            const itemsSizes = [
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
            ];
            calculator.updateItemsSizes(itemsSizes, true);

            const result = calculator.addItems(0, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 2, endIndex: 12 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 150,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 5, endIndex: 15 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes,
                },
                scrollMode: null,
            });
        });

        it('should save endIndex if add items to the start and list is scrolled to end', () => {
            // Если список проскролен в конец, то диапазон нужно оставить прижатым к этому концу
            calculator.updateItemsSizes(
                [
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
            calculator.scrollPositionChange(200, false);

            const result = calculator.addItems(0, 2, 'shift');

            expect(result).toEqual({
                range: { startIndex: 2, endIndex: 12 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 2, endIndex: 12 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: [
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
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
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
                range: { startIndex: 0, endIndex: 13 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
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

        it('should calculate range after adding items to empty list', () => {
            calculator.resetItems(0, { startIndex: 0, endIndex: null });
            calculator.updateItemsSizes([], false);
            calculator.updateItemsSizes(
                [
                    { size: 50, offset: 0, key: '1' },
                    { size: 50, offset: 50, key: '2' },
                    { size: 50, offset: 100, key: '3' },
                    { size: 50, offset: 150, key: '4' },
                    { size: 50, offset: 200, key: '5' },
                ],
                true
            );

            const result = calculator.addItems(0, 5, 'shift');

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 5 },
                shiftDirection: 'forward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 0 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: [
                        { size: 50, offset: 0, key: '1' },
                        { size: 50, offset: 50, key: '2' },
                        { size: 50, offset: 100, key: '3' },
                        { size: 50, offset: 150, key: '4' },
                        { size: 50, offset: 200, key: '5' },
                    ],
                },
                scrollMode: null,
            });
        });

        it('should recalculate range if calcMode=nothing and add items before range', () => {
            const itemsSizes = [
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
            ];
            calculator.scrollPositionChange(100, false);
            calculator.updateItemsSizes(itemsSizes, true);
            calculator.addItems(0, 5, 'shift');
            calculator.updateItemsSizes(
                [{ size: 0, offset: 0 }, { size: 0, offset: 0 }, ...itemsSizes],
                false
            );

            const result = calculator.addItems(0, 2, 'nothing');

            expect(result).toEqual({
                range: { startIndex: 4, endIndex: 14 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 150,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: true,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 4, endIndex: 14 },
                    placeholders: { backward: 0, forward: 150 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes: [
                        { size: 0, offset: 0 },
                        { size: 0, offset: 0 },
                        ...itemsSizes,
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
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
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
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
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
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after removing all items', () => {
            const result = calculator.removeItems(0, 10);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 0 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range after removing items outside range', () => {
            calculator.scrollPositionChange(100, false);
            const itemsSizes = [
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
            ];
            calculator.updateItemsSizes(itemsSizes, true);
            calculator.addItems(0, 5, 'shift');

            const result = calculator.removeItems(0, 2);

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 12 },
                shiftDirection: 'backward',
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 50,
                },
                placeholdersChanged: true,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 2, endIndex: 12 },
                    placeholders: { backward: 0, forward: 150 },
                    hasItemsOutsideOfRange: { backward: true, forward: true },
                    itemsSizes,
                },
                scrollMode: null,
            });
        });
    });

    describe('resetItems', () => {
        it('should calculate range when was empty list, became not empty', () => {
            calculator.resetItems(0, { startIndex: 0, endIndex: null });

            const result = calculator.resetItems(20, {
                startIndex: 0,
                endIndex: null,
            });

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 10 },
                shiftDirection: null,
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: true,
                },
                hasItemsOutsideOfRangeChanged: true,
                oldState: {
                    range: { startIndex: 0, endIndex: 0 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range when was not empty list, became empty', () => {
            const result = calculator.resetItems(0, {
                startIndex: 0,
                endIndex: null,
            });

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 0 },
                shiftDirection: null,
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range when changed items count', () => {
            const result = calculator.resetItems(7, {
                startIndex: 0,
                endIndex: null,
            });

            expect(result).toEqual({
                range: { startIndex: 0, endIndex: 7 },
                shiftDirection: null,
                indexesChanged: true,
                placeholders: {
                    backward: 0,
                    forward: 0,
                },
                placeholdersChanged: false,
                hasItemsOutsideOfRange: {
                    backward: false,
                    forward: false,
                },
                hasItemsOutsideOfRangeChanged: false,
                oldState: {
                    range: { startIndex: 0, endIndex: 10 },
                    placeholders: { backward: 0, forward: 0 },
                    hasItemsOutsideOfRange: { backward: false, forward: false },
                    itemsSizes: undefined,
                },
                scrollMode: null,
            });
        });

        it('should calculate range start with 0', () => {
            calculator.resetItems(20, { startIndex: 0, endIndex: null });

            expect(calculator.getRange()).toEqual({
                startIndex: 0,
                endIndex: 10,
            });
        });

        it('should calculate range start with 5', () => {
            calculator.resetItems(20, { startIndex: 5, endIndex: null });

            expect(calculator.getRange()).toEqual({
                startIndex: 5,
                endIndex: 15,
            });
        });

        it('should calculate range by givenItemsSizes', () => {
            calculator.updateGivenItemsSizes([
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
            ]);

            calculator.resetItems(10, { startIndex: 0, endIndex: null });

            expect(calculator.getRange()).toEqual({
                startIndex: 0,
                endIndex: 7,
            });
        });

        it('should calculate range by givenItemsSizes from end', () => {
            calculator.updateGivenItemsSizes([
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
            ]);

            calculator.resetItems(10, { startIndex: 5, endIndex: null });

            expect(calculator.getRange()).toEqual({
                startIndex: 3,
                endIndex: 10,
            });
        });

        it('should calculate range by givenItemsSizes from start to end', () => {
            calculator.updateGivenItemsSizes([
                { size: 50, offset: 0, key: '1' },
                { size: 50, offset: 50, key: '2' },
                { size: 100, offset: 100, key: '3' },
                { size: 150, offset: 200, key: '4' },
                { size: 200, offset: 350, key: '5' },
            ]);

            calculator.resetItems(5, { startIndex: 2, endIndex: null });

            expect(calculator.getRange()).toEqual({
                startIndex: 2,
                endIndex: 5,
            });
        });

        it('should calculate range by initRange', () => {
            calculator.resetItems(20, { startIndex: 3, endIndex: 17 });

            expect(calculator.getRange()).toEqual({
                startIndex: 3,
                endIndex: 17,
            });
        });

        it('should calculate range is endIndex is more than totalCount', () => {
            calculator.resetItems(20, { startIndex: 3, endIndex: 22 });

            expect(calculator.getRange()).toEqual({
                startIndex: 10,
                endIndex: 20,
            });
        });
    });
});
