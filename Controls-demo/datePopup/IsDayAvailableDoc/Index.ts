import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/datePopup/IsDayAvailableDoc/Index';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 6, 10);
    protected _endValue: Date = new Date(2022, 6, 10);

    protected _isDayAvailable(date: Date): boolean {
        // Заблокируем выбор всех понедельников и пятниц
        return date.getDay() !== 1 && date.getDay() !== 5;
    }
}
