import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/VerticalTabs/Index';
import { RecordSet } from 'Types/collection';

export default class FloatingTabsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    key: 1,
                    title: 'Заказ',
                },
                {
                    key: 2,
                    title: 'Отгрузка',
                    mainCounter: 852600,
                },
                {
                    key: 3,
                    title: 'Отгрузка',
                    mainCounter: 52600,
                },
            ],
            keyProperty: 'id',
        });
    }
}
