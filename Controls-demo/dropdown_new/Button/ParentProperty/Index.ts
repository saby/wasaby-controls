import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ParentProperty/Index');
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: '1', title: 'В любом состоянии', parent: null, '@parent': null },
                {
                    key: '2',
                    title: 'Завершенные',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: '3',
                    icon: 'icon-Successful',
                    iconStyle: 'success',
                    title: 'Положительно',
                    parent: '2',
                    '@parent': null,
                },
                {
                    key: '4',
                    icon: 'icon-Minus',
                    iconStyle: 'danger',
                    title: 'Отрицательно',
                    parent: '2',
                    '@parent': null,
                },
            ],
        });
    }
}
