import Utils from 'Controls/_dateRange/Utils';

describe('Controls/_dateRange/Utils', () => {
    describe('getWeekdaysCaptions', () => {
        it('should return default locale', () => {
            const resp = Utils.getWeekdaysCaptions();
            const captions = [
                {
                    caption: 'пн',
                    weekend: false,
                    day: 0,
                },
                {
                    caption: 'вт',
                    weekend: false,
                    day: 1,
                },
                {
                    caption: 'ср',
                    weekend: false,
                    day: 2,
                },
                {
                    caption: 'чт',
                    weekend: false,
                    day: 3,
                },
                {
                    caption: 'пт',
                    weekend: false,
                    day: 4,
                },
                {
                    caption: 'сб',
                    weekend: true,
                    day: 5,
                },
                {
                    caption: 'вс',
                    weekend: true,
                    day: 6,
                },
            ];
            expect(resp).toEqual(captions);
        });
    });

    describe('getQuantByRange', () => {
        [
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 1, 0),
                result: 'month',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 9, 0),
                result: 'monthsRange',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 0, 1),
                result: 'date',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 0, 5),
                result: 'dateRange',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 1, 5),
                result: 'dateRange',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 11, 31),
                result: 'year',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2022, 11, 31),
                result: 'yearsRange',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 6, 0),
                result: 'halfyear',
            },
            {
                startValue: new Date(2021, 0, 1),
                endValue: new Date(2021, 3, 0),
                result: 'quarter',
            },
        ].forEach((test) => {
            it('should return correct quant: ' + test.result, () => {
                const quant = Utils.getQuantByRange(
                    test.startValue,
                    test.endValue
                );
                expect(test.result).toEqual(quant);
            });
        });
    });
});
