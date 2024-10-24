import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/LiteSelector/HeaderContentTemplate/HeaderContentTemplate');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2020, 0);
    protected _endValue: Date = new Date(2021, 0, 0);

    protected _getHeaderCaption(startValue: Date, endValue: Date): string {
        let caption = 'Период с ' + (startValue.getMonth() + 1) + ' месяца';
        caption += ' по ' + (endValue.getMonth() + 1) + ' месяц';
        return caption;
    }
}

export default DemoControl;
