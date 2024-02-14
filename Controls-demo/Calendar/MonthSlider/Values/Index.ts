import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Calendar/MonthSlider/Values/Values');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    private _month: Date = new Date(2017, 0, 1);
    private _startValue: Date = new Date(2017, 0, 5);
    private _endValue: Date = new Date(2017, 0, 15);

    private _changeStartValue(event: Event, coeff: number): void {
        this._startValue = new Date(
            this._startValue.getFullYear(),
            this._startValue.getMonth(),
            this._startValue.getDate() - coeff
        );
    }

    private _changeEndValue(event: Event, coeff: number): void {
        this._endValue = new Date(
            this._endValue.getFullYear(),
            this._endValue.getMonth(),
            this._endValue.getDate() + coeff
        );
    }
}

export default DemoControl;
