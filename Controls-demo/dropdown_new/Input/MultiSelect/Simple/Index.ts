import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/MultiSelect/Simple/Index';
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
                { id: '1', title: 'Banking and financial services, credit' },
                { id: '2', title: 'Gasoline, diesel fuel, light oil products' },
                { id: '3', title: 'Transportation, logistics, customs' },
                { id: '4', title: 'Oil and oil products' },
                { id: '5', title: 'Pipeline transportation services' },
                {
                    id: '6',
                    title: 'Services in tailoring and repair of clothes, textiles',
                },
                {
                    id: '7',
                    title: 'Computers and components, computing, office equipment',
                },
            ],
        });
    }
}
