import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Decorator/Group/Template');
import { date } from 'Types/formatter';
import 'css!Controls-demo/Decorator/Group/Style';

class DecoratorGroup extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value: Date = new Date('December 17, 2021 10:00:00');
    protected _value2: string = 'Я подсвечиваю текст, который вам требуется';
    protected _format: string = date.FULL_DATETIME;
}

export default DecoratorGroup;
