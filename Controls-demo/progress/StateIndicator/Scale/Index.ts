import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/StateIndicator/Scale/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _data: object;

    protected _beforeMount(): void {
        this._data = [{ value: 5, className: '', title: 'Положительно' }];
    }
}

export default Base;
