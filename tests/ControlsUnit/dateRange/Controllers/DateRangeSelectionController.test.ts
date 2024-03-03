import DateRangeSelectionController from 'Controls/_dateRange/Controllers/DateRangeSelectionController';
import calendarTestUtils = require('ControlsUnit/Calendar/Utils');

describe('Controls/_dateRange/Controllers/DateRangeSelectionController', () => {
    describe('_beforeMount', () => {
        [
            {
                quantum: {
                    days: [1, 3],
                    weeks: [4],
                },
                result: false,
            },
            {
                quantum: {
                    days: [1],
                },
                result: true,
            },
            {
                quantum: {
                    days: [1, 3],
                },
                result: false,
            },
            {
                quantum: {
                    weeks: [4],
                },
                result: true,
            },
            {
                quantum: {
                    weeks: [1, 4],
                },
                result: false,
            },
            {
                quantum: {
                    days: [1, 3],
                    weeks: [4],
                },
                result: false,
            },
        ].forEach((test) => {
            it('should calculate _isSingleQuant correctly', () => {
                const component = calendarTestUtils.createComponent(DateRangeSelectionController, {
                    quantum: test.quantum,
                    selectionType: 'quantum',
                });
                expect(test.result).toEqual(component._isSingleQuant);
            });
        });
    });
    describe('_beforeUpdate', () => {
        [
            {
                initialOptions: {
                    startValue: new Date(2020, 0, 1),
                    endValue: new Date(2020, 0, 1),
                },
                newOptions: {
                    startValue: new Date(2020, 0, 1),
                    endValue: new Date(2020, 0, 31),
                },
                state: {
                    startValue: new Date(2020, 0, 1),
                    endValue: new Date(2020, 0, 31),
                    displayedStartValue: new Date(2020, 0, 1),
                    displayedEndValue: new Date(2020, 0, 31),
                },
            },
        ].forEach((test, i) => {
            it(`should set proper state for options ${JSON.stringify(
                test.initialOptions
            )} -> ${JSON.stringify(test.newOptions)}.`, () => {
                const component: DateRangeSelectionController = calendarTestUtils.createComponent(
                    DateRangeSelectionController,
                    test.initialOptions
                );

                component._beforeUpdate(test.newOptions);

                for (const field in test.state) {
                    if (test.state.hasOwnProperty(field)) {
                        expect(+component['_' + field]).toBe(+test.state[field]);
                    }
                }
            });
        });
    });
    describe('_getDisplayedRangeEdges', () => {
        [
            {
                initialOptions: {
                    startValue: new Date(2020, 0, 1),
                    endValue: new Date(2020, 0, 1),
                    rangeSelectedCallback: (startValue, endValue) => {
                        return [
                            new Date(
                                startValue.getFullYear(),
                                startValue.getMonth(),
                                startValue.getDate() + 2
                            ),
                            new Date(
                                startValue.getFullYear(),
                                startValue.getMonth(),
                                startValue.getDate() + 6
                            ),
                        ];
                    },
                },
                resultRange: [new Date(2020, 0, 3), new Date(2020, 0, 7)],
            },
            {
                initialOptions: {
                    startValue: new Date(2020, 5, 10),
                    endValue: new Date(2020, 5, 10),
                    selectionType: 'quantum',
                    quantum: { weeks: [1] },
                    rangeSelectedCallback: (startValue) => {
                        return [
                            new Date(
                                startValue.getFullYear(),
                                startValue.getMonth(),
                                startValue.getDate() + 1
                            ),
                            new Date(
                                startValue.getFullYear(),
                                startValue.getMonth(),
                                startValue.getDate() + 2
                            ),
                        ];
                    },
                },
                resultRange: [new Date(2020, 5, 9), new Date(2020, 5, 10)],
            },
        ].forEach((test, i) => {
            it(`should return proper range for options ${JSON.stringify(
                test.initialOptions
            )}.`, () => {
                const component: DateRangeSelectionController = calendarTestUtils.createComponent(
                    DateRangeSelectionController,
                    test.initialOptions
                );

                const range = component._getDisplayedRangeEdges(test.initialOptions.startValue);
                expect(range).toEqual(test.resultRange);
            });
        });
    });
    describe('_itemClickHandler', () => {
        it('should not start selection if argument is not date', () => {
            const component: DateRangeSelectionController = calendarTestUtils.createComponent(
                DateRangeSelectionController,
                { selectionType: 'workdays' }
            );
            const notDate = {};
            const processSingleSelection = jest
                .spyOn(component, '_processSingleSelection')
                .mockClear()
                .mockImplementation();
            component._itemClickHandler(null, notDate);
            expect(processSingleSelection).not.toHaveBeenCalled();
            jest.restoreAllMocks();
        });
    });
});
