import MonthsRangeItem from 'Controls/_datePopup/MonthsRangeItem';
import MonthsRange from 'Controls/_datePopup/MonthsRange';
import calendarTestUtils = require('ControlsUnit/Calendar/Utils');

describe('Controls/_datePopup/MonthsRange', () => {
    const selectionViewTypeTests = [
        {
            options: {},
            selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.days,
        },
        {
            options: {
                startValue: new Date(2019, 0),
            },
            selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.days,
        },
        {
            options: {
                endValue: new Date(2019, 1, 0),
            },
            selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.days,
        },
        {
            options: {
                startValue: new Date(2019, 1, 2),
                endValue: new Date(2019, 1, 3),
            },
            selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.days,
        },
        {
            options: {
                startValue: new Date(2019, 0),
                endValue: new Date(2019, 1, 0),
            },
            selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.months,
        },
    ];

    describe('Initialisation', () => {
        selectionViewTypeTests.forEach((test) => {
            it(`should set proper _selectionViewType for options ${JSON.stringify(
                test.options
            )}.`, () => {
                const component = calendarTestUtils.createComponent(
                    MonthsRange,
                    test.options
                );
                expect(component._selectionViewType).toBe(
                    test.selectionViewType
                );
            });
        });
    });

    describe('_beforeUpdate', () => {
        [
            ...selectionViewTypeTests,
            {
                options: {
                    startValue: new Date(2019, 0),
                    endValue: new Date(2019, 0, 1),
                    selectionProcessing: true,
                },
                selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.months,
            },
        ].forEach((test) => {
            it(`should set proper _selectionViewType for options ${JSON.stringify(
                test.options
            )}.`, () => {
                const component = calendarTestUtils.createComponent(
                    MonthsRange,
                    {
                        startValue: new Date(2019, 0),
                        endValue: new Date(2019, 1, 0),
                    }
                );

                component._beforeUpdate(
                    calendarTestUtils.prepareOptions(MonthsRange, {
                        ...{ position: new Date(2019, 0) },
                        ...test.options,
                    })
                );

                expect(component._selectionViewType).toBe(
                    test.selectionViewType
                );
            });
        });
    });
});
