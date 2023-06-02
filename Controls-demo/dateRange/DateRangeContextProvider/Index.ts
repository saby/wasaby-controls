import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dateRange/DateRangeContextProvider/DateRangeContextProvider';
import { Utils } from 'Controls/dateRange';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _startValue1: Date = new Date(2021, 0, 1);
    protected _endValue1: Date = new Date(2021, 0, 31);
    protected _startValue2: Date = new Date(2021, 0, 1);
    protected _endValue2: Date = new Date(2021, 0, 31);
    protected _startValue3: Date = new Date(2021, 0, 1);
    protected _endValue3: Date = new Date(2021, 0, 31);
    protected _startValue4: Date = new Date(2021, 0);
    protected _endValue4: Date = new Date(2021, 0, 31);

    protected _quant: string;

    protected _beforeMount(): void {
        this._quant = Utils.getQuantByRange(this._startValue4, this._endValue4);
    }

    protected _rangeChangedHandler(
        event: Event,
        startValue: Date,
        endValue: Date
    ): void {
        this._quant = Utils.getQuantByRange(startValue, endValue);
    }
}
