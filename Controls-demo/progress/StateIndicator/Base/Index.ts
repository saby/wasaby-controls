import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/StateIndicator/Base/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _data: object;
    protected _dataWithTwoCategories: object;
    protected _dataWithThreeCategories: object;

    protected _beforeMount(): void {
        this._data = [{ value: 50, className: '', tooltip: 'Положительно' }];
        this._dataWithTwoCategories = [
            { value: 50, className: '', tooltip: 'Положительно' },
            { value: 20, className: '', tooltip: 'В работе' },
        ];
        this._dataWithThreeCategories = [
            { value: 10, className: '', tooltip: 'Положительно' },
            { value: 30, className: '', tooltip: 'В работе' },
            { value: 50, className: '', tooltip: 'Отрицательно' },
        ];
    }
}

export default Base;
