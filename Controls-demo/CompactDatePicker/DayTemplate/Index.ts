import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/DayTemplate/Template');
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';
import 'css!Controls-demo/CompactDatePicker/DayTemplate/DayTemplate';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2022, 0, 7);
    protected _endValue: Date = new Date(2022, 0, 7);
    protected _date: Date = new Date(2022, 2, 1);

    protected _getBackgroundStyle(dayTemplate): string {
        if (dayTemplate.value.selected) {
            return dayTemplate.backgroundStyle;
        }
        if (dayTemplate.value.day > 3 && dayTemplate.value.day < 11) {
            return 'success';
        }
        if (
            dayTemplate.value.dayOfWeek === 5 ||
            dayTemplate.value.dayOfWeek === 6
        ) {
            return 'danger';
        }
        return 'secondary';
    }
}
