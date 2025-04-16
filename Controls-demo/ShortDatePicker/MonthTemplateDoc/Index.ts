import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/ShortDatePicker/MonthTemplateDoc/Template');
import 'css!Controls-demo/ShortDatePicker/ShortDatePicker';
import { date as formatDate } from 'Types/formatter';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 0);
    protected _endValue: Date = new Date(2022, 11, 31);

    protected _formatDate: Function = formatDate;

    protected _getText(date: Date): string {
        return this._formatDate(date, 'MMMM') + this._isQuarter(date.getMonth());
    }

    protected _isQuarter(month): string {
        switch (month) {
            case 2:
                return ', Iкв.';
            case 5:
                return ', IIкв., I полугодие';
            case 8:
                return ', IIIкв., 9 мес.';
            case 11:
                return ', IVкв., год';
        }

        return '';
    }
}

export default DemoControl;
