import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/LinkView/FontWeight/FontWeight');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _startValue: Date = new Date(2019, 1);
    protected _endValue: Date = new Date(2019, 2, 0);

    static _styles: string[] = [
        'Controls-demo/dateRange/LiteSelector/LiteSelector',
    ];
}

export default DemoControl;
