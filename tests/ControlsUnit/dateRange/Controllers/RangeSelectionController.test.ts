import RangeSelectionController from 'Controls/_dateRange/Controllers/RangeSelectionController';
import calendarTestUtils = require('ControlsUnit/Calendar/Utils');

describe('Controls/_dateRange/Controllers/RangeSelectionController', () => {
    describe('_getDisplayedRangeEdges', () => {
        [
            {
                options: {
                    selectionType: RangeSelectionController.SELECTION_TYPES.single,
                    selectionBaseValue: null,
                },
                item: new Date(2019, 0, 1),
                resp: [new Date(2019, 0, 1), new Date(2019, 0, 1)],
            },
            {
                options: {
                    selectionType: RangeSelectionController.SELECTION_TYPES.range,
                    selectionBaseValue: null,
                },
                item: new Date(2019, 0, 1),
                resp: [new Date(2019, 0, 1), new Date(2019, 0, 1)],
            },
            {
                options: {
                    selectionType: RangeSelectionController.SELECTION_TYPES.range,
                    selectionBaseValue: new Date(2019, 0, 1),
                },
                item: new Date(2019, 0, 5),
                resp: [new Date(2019, 0, 1), new Date(2019, 0, 5)],
            },
        ].forEach((test) => {
            it(`should return proper range for options ${JSON.stringify(test.options)}.`, () => {
                const component: RangeSelectionController = calendarTestUtils.createComponent(
                    RangeSelectionController,
                    test.options
                );

                const range = component._getDisplayedRangeEdges(test.item);
                expect(range[0]).not.toBe(range[1]);
                expect(range).toEqual(test.resp);
            });
        });
    });

    describe('_mouseleaveHandler', () => {
        [
            {
                clickedItem: new Date(2019, 0, 10),
                hoveredItem: new Date(2019, 0, 11),
            },
            {
                clickedItem: new Date(2019, 0, 10),
                hoveredItem: new Date(2019, 0, 9),
            },
        ].forEach((test) => {
            it(`should reset hovered item ${JSON.stringify(test)}.`, () => {
                const component: RangeSelectionController = calendarTestUtils.createComponent(
                    RangeSelectionController,
                    {}
                );

                component._itemClickHandler(null, test.clickedItem);
                component._itemMouseEnterHandler(null, test.hoveredItem);

                component._mouseleaveHandler();

                expect(+component._selectionHoveredValue).toBe(+test.clickedItem);
                expect(+component._displayedStartValue).toBe(+test.clickedItem);
                expect(+component._displayedEndValue).toBe(+test.clickedItem);
                expect(+component._startValue).toBe(+test.clickedItem);
                expect(+component._endValue).toBe(+test.clickedItem);
            });
        });
    });

    describe('_itemKeyDownHandler', () => {
        [
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 40,
                    },
                },
                hoveredItem: new Date(2021, 1, 1),
                eventName: 'itemMouseEnter',
                eventOptions: new Date(2021, 4, 1),
            },
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 38,
                    },
                },
                hoveredItem: new Date(2021, 1, 1),
                eventName: 'itemMouseEnter',
                eventOptions: new Date(2020, 10, 1),
            },
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 37,
                    },
                },
                hoveredItem: new Date(2021, 1, 1),
                eventName: 'itemMouseEnter',
                eventOptions: new Date(2021, 0, 1),
            },
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 39,
                    },
                },
                hoveredItem: new Date(2021, 1, 1),
                eventName: 'itemMouseEnter',
                eventOptions: new Date(2021, 2, 1),
            },
        ].forEach((test) => {
            it('should choose correct date', () => {
                const component: RangeSelectionController = calendarTestUtils.createComponent(
                    RangeSelectionController,
                    {}
                );
                const start = new Date(2018, 0, 1);
                global.document = {
                    querySelector: () => {
                        return null;
                    },
                };
                let callbackCalled = false;
                let date;
                if (test.hoveredItem) {
                    component._selectionHoveredValue = test.hoveredItem;
                }
                component._itemMouseEnter = (item) => {
                    date = item;
                    callbackCalled = true;
                };

                component._itemKeyDownHandler(
                    test.event,
                    start,
                    test.event.nativeEvent.keyCode,
                    '.controls-PeriodDialog-MonthsRange__item',
                    'months'
                );

                expect(callbackCalled).toBe(true);
                expect(date.getFullYear()).toEqual(test.eventOptions.getFullYear());
                expect(date.getMonth()).toEqual(test.eventOptions.getMonth());
                expect(date.getDate()).toEqual(test.eventOptions.getDate());
            });
        });
        [
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 39,
                    },
                },
                eventName: null,
            },
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 40,
                    },
                },
                eventName: null,
            },
            {
                options: { selectionProcessing: true, monthClickable: false },
                event: {
                    preventDefault: () => {
                        return 0;
                    },
                    nativeEvent: {
                        keyCode: 55,
                    },
                },
                hoveredItem: new Date(2021, 1, 1),
                eventName: 'itemMouseEnter',
                eventOptions: new Date(2021, 2, 1),
            },
        ].forEach((test) => {
            it('should generate event with correct date', () => {
                const component: RangeSelectionController = calendarTestUtils.createComponent(
                    RangeSelectionController,
                    {}
                );
                global.document = {
                    querySelector: () => {
                        return null;
                    },
                };
                let callbackCalled = false;
                if (test.hoveredItem) {
                    component._hoveredItem = test.hoveredItem;
                }
                component._itemMouseEnter = () => {
                    callbackCalled = true;
                };
                component._itemKeyDownHandler(test.event);
                expect(callbackCalled).toBe(false);
            });
        });
    });
    describe('_itemMouseEnter', () => {
        [
            {
                displayedStartValue: new Date(2020, 0, 1),
                item: new Date(2019, 11, 1),
                options: {
                    selectionType: 'quantum',
                },
            },
            {
                displayedEndValue: new Date(2020, 0, 1),
                item: new Date(2022, 0, 1),
                options: {
                    selectionType: 'quantum',
                },
            },
            {
                displayedStartValue: new Date(2020, 0, 1),
                item: new Date(2019, 11, 1),
                options: {
                    rangeSelectedCallback: () => {
                        return;
                    },
                },
            },
            {
                displayedEndValue: new Date(2020, 0, 1),
                item: new Date(2022, 0, 1),
                options: {
                    rangeSelectedCallback: () => {
                        return;
                    },
                },
            },
        ].forEach((test) => {
            it('should set hovered value as startValue or endValue if selectionType is quantum or there is rangeSelectedCallback', () => {
                const component: RangeSelectionController = calendarTestUtils.createComponent(
                    RangeSelectionController,
                    test.options
                );
                component._selectionProcessing = true;

                component._selectionBaseValue = new Date(2020, 0, 1);
                component._displayedStartValue = test.displayedStartValue;
                component._displayedEndValue = test.displayedEndValue;

                jest.spyOn(component, '_updateDisplayedRange').mockClear().mockReturnValue(true);
                component._itemMouseEnter(test.item);
                if (test.displayedStartValue) {
                    expect(test.displayedStartValue).toEqual(component._selectionHoveredValue);
                } else {
                    expect(test.displayedEndValue).toEqual(component._selectionHoveredValue);
                }
                jest.restoreAllMocks();
            });
        });
    });
});
