import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/LiteSelector/CaptionFormatter/CaptionFormatter');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _startValue: Date = new Date(2020, 0);
    protected _endValue: Date = new Date(2021, 0, 0);

    _captionFormatter(startValue: Date, endValue: Date, emptyCaption: string): string {
        return startValue ? startValue.getMonth() + ' месяц' : emptyCaption;
    }
}

export default DemoControl;
