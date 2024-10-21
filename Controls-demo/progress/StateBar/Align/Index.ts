import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/StateBar/Align/Template');

class StateBar extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _data: object[];

    protected _beforeMount(): void {
        this._data = [
            {
                value: 20,
                title: 'Положительно',
                style: 'success',
            },
            {
                value: 40,
                title: 'В работе',
                style: 'warning',
            },
            {
                value: 10,
                title: 'Отрицательно',
                style: 'danger',
            },
        ];
    }
}

export default StateBar;
