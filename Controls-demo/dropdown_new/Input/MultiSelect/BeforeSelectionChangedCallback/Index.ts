import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/MultiSelect/BeforeSelectionChangedCallback/Index';
import { Memory } from 'Types/source';
import {ISelectionDifference} from 'Controls/multiselection';
import {ISelectionObject} from 'Controls/interface';

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

    protected _beforeSelectionChangedCallback(selectionChanged: ISelectionDifference): ISelectionObject|void {
        if (!selectionChanged.selectedKeysDifference?.keys.length) {
            return {
                selected: ['1'],
                excluded: [],
            };
        }
    }
}
