import utils from 'Controls/_datePopup/RangeSelection';

describe('Controls/_dateRange/Utils/RangeSelection', () => {
    describe('prepareSelectionClass', () => {
        const date: Date = new Date(2019, 0, 1);
        [
            {
                args: {
                    date,
                },
                css: '',
            },
            {
                args: {
                    date,
                    startValue: date,
                    endValue: date,
                },
                css: 'controls-RangeSelection__selected-start-end',
            },
            {
                args: {
                    date,
                    startValue: date,
                    endValue: new Date(2019, 0, 2),
                },
                css: 'controls-RangeSelection__selected-start',
            },
            {
                args: {
                    date,
                    startValue: new Date(2019, 0, 0),
                    endValue: date,
                },
                css: 'controls-RangeSelection__selected-end',
            },
            {
                args: {
                    date,
                    startValue: new Date(2019, 0, 0),
                    endValue: new Date(2019, 0, 2),
                },
                css: 'controls-RangeSelection__selected-inner',
            },
            {
                args: {
                    date,
                    selectionProcessing: true,
                    startValue: date,
                    baseSelectionValue: date,
                },
                css: 'controls-RangeSelection__start-base',
            },
        ].forEach((test) => {
            it(`should return correct css class if arguments are equal to ${JSON.stringify(
                test.args
            )}.`, () => {
                expect(
                    utils.prepareSelectionClass(
                        test.args.date,
                        test.args.startValue,
                        test.args.endValue,
                        test.args.selectionProcessing,
                        test.args.baseSelectionValue,
                        test.args.hoveredSelectionValue,
                        test.args.hoveredStartValue,
                        test.args.hoveredEndValue
                    )
                ).toBe(test.css);
            });
        });
    });
    describe('isSelected', () => {
        [
            {
                itemValue: new Date(2021, 0, 1),
                startValue: new Date(2020, 11, 1),
                endValue: new Date(2021, 1, 1),
            },
            {
                itemValue: new Date(2021, 0, 1),
                startValue: new Date(2020, 11, 1),
                endValue: new Date(2021, 1, 1),
                selectionProcessing: true,
                baseSelectionValue: new Date(2020, 11, 1),
                hoveredSelectionValue: new Date(2021, 5, 1),
            },
        ].forEach((test) => {
            it('should return true', () => {
                const isSelected = utils.isSelected(
                    test.itemValue,
                    test.startValue,
                    test.endValue,
                    test.selectionProcessing,
                    test.baseSelectionValue,
                    test.hoveredSelectionValue
                );
                expect(isSelected).toBe(true);
            });
        });

        [
            {
                itemValue: new Date(2021, 0, 1),
                startValue: new Date(2021, 1, 1),
                endValue: new Date(2021, 2, 1),
            },
            {
                itemValue: new Date(2021, 0, 1),
                startValue: new Date(2020, 11, 1),
                endValue: new Date(2021, 1, 1),
                selectionProcessing: true,
                baseSelectionValue: new Date(2020, 11, 1),
                hoveredSelectionValue: new Date(2020, 5, 1),
            },
        ].forEach((test) => {
            it('should return false', () => {
                const isSelected = utils.isSelected(
                    test.itemValue,
                    test.startValue,
                    test.endValue,
                    test.selectionProcessing,
                    test.baseSelectionValue,
                    test.hoveredSelectionValue
                );
                expect(isSelected).toBe(false);
            });
        });
    });
});
