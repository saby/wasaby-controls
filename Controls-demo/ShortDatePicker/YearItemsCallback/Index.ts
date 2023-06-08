import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as template from 'wml!Controls-demo/ShortDatePicker/YearItemsCallback/Index';

export default class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 6, 4);
    protected _endValue: Date = new Date(2022, 6, 10);
    protected _displayedRanges: Date[][] = [
        [new Date(2022, 0), new Date(2023, 11)],
    ];
    protected _yearItemsCallback: Function;

    protected _beforeMount(): void {
        this._yearItemsCallback = this._setYearItems.bind(this);
    }

    protected _setYearItems(year: Date): object[] {
        let items = [];
        if (year.getFullYear() === 2022) {
            items = [
                {
                    startValue: new Date(2022, 6, 11),
                    endValue: new Date(2022, 6, 17),
                    tooltip: '11.07 - 17.07',
                },
                {
                    startValue: new Date(2022, 6, 4),
                    endValue: new Date(2022, 6, 10),
                    tooltip: '04.07 - 10.07',
                },
                {
                    startValue: new Date(2022, 5, 27),
                    endValue: new Date(2022, 6, 3),
                    tooltip: '27.06 - 03.07',
                },
                {
                    startValue: new Date(2022, 5, 20),
                    endValue: new Date(2022, 5, 26),
                    tooltip: '20.06 - 26.06',
                },
            ];
        } else {
            items = [
                {
                    startValue: new Date(year.getFullYear(), 0, 1),
                    endValue: new Date(year.getFullYear(), 0, 7),
                    tooltip: '01.01 - 07.01',
                },
                {
                    startValue: new Date(year.getFullYear(), 0, 8),
                    endValue: new Date(year.getFullYear(), 0, 14),
                    tooltip: '08.01 - 14.01',
                },
            ];
        }
        return items;
    }

    protected _sendResultHandler(
        e: SyntheticEvent,
        startValue: Date,
        endValue: Date
    ): void {
        this._startValue = startValue;
        this._endValue = endValue;
    }
}
