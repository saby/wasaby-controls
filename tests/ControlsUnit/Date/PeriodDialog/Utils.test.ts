import datePopupUtils from 'Controls/_datePopup/Utils';
import dateUtils = require('Controls/dateUtils');
import { IDateRangeSelectable } from 'Controls/dateRange';

describe('Controls/_datePopup/Utils', () => {
    describe('dataStringToDate', () => {
        [
            {
                str: '2019.1',
                date: new Date(2019, 0, 1),
            },
            {
                str: '2019.12',
                date: new Date(2019, 11, 1),
            },
        ].forEach((test) => {
            it('should create the correct models when empty range passed.', () => {
                expect(
                    dateUtils.Base.isDatesEqual(
                        datePopupUtils.dataStringToDate(test.str),
                        test.date
                    )
                ).toBeTruthy();
            });
        });
    });

    describe('isMonthStateEnabled', () => {
        [
            {
                options: { minRange: 'day' },
                isEnabled: true,
            },
            {
                options: { ranges: {}, minRange: 'day' },
                isEnabled: true,
            },
            {
                options: { ranges: { days: [1] } },
                isEnabled: true,
            },
            {
                options: { ranges: { weeks: [1] } },
                isEnabled: true,
            },
            {
                options: { minRange: 'month' },
                isEnabled: false,
            },
        ].forEach((test) => {
            it(`should return ${test.isEnabled} if ${test.options} passed.`, () => {
                expect(
                    datePopupUtils.isMonthStateEnabled(test.options)
                ).toEqual(test.isEnabled);
            });
        });
    });

    describe('isYearStateEnabled', () => {
        [
            {
                options: {
                    selectionType: IDateRangeSelectable.SELECTION_TYPES.single,
                    minRange: IDateRangeSelectable.minRange.month,
                },
                isEnabled: true,
            },
            {
                options: {
                    selectionType: IDateRangeSelectable.SELECTION_TYPES.range,
                },
                isEnabled: true,
            },
            {
                options: {
                    selectionType: IDateRangeSelectable.SELECTION_TYPES.range,
                    ranges: {},
                },
                isEnabled: true,
            },
            {
                options: {
                    selectionType: IDateRangeSelectable.SELECTION_TYPES.range,
                    ranges: { months: [1] },
                },
                isEnabled: true,
            },
        ].forEach((test) => {
            it(`should return ${test.isEnabled} if ${test.options} passed.`, () => {
                expect(datePopupUtils.isYearStateEnabled(test.options)).toEqual(
                    test.isEnabled
                );
            });
        });
    });
});
