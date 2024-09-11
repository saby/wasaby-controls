import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/SelectedAllText/SelectedAllKey/Index';
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _dataLoadCallback: Function;
    protected _items: RecordSet;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                { id: '1', title: 'Отчетность' },
                { id: '2', title: 'Реализация' },
                { id: '3', title: 'Поступления' },
            ],
        });
    }
}
