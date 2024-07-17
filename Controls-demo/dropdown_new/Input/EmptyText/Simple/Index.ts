import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/EmptyText/Simple/Index';
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _dataLoadCallback: Function;
    protected _source: Memory;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                { id: '1', title: 'Banking and financial services, credit' },
                { id: '2', title: 'Gasoline, diesel fuel, light oil products' },
                { id: '3', title: 'Transportation, logistics, customs' },
                { id: '4', title: 'Oil and oil products' },
            ],
        });
    }
}
