import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/extendedDecorator/DateRange/Default/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _startValue: Date = new Date(2023, 1, 1, 1);
    protected _endValue: Date = new Date(2023, 1, 1, 3, 25);
}
