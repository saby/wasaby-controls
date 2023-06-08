import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/MultiSelect/Hierarchy/Index';
import { Memory } from 'Types/source';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _dataLoadCallback: Function;
    protected _source: Memory;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._source = new ExplorerMemory({
            keyProperty: 'id',
            data: [
                { id: '1', title: 'Assignment', parent: null, '@parent': true },
                {
                    id: '2',
                    title: 'Task in development',
                    parent: null,
                    '@parent': false,
                },
                {
                    id: '3',
                    title: 'Error in development',
                    parent: null,
                    '@parent': false,
                },
                {
                    id: '4',
                    title: 'Application',
                    parent: null,
                    '@parent': false,
                },
                { id: '5', title: 'Approval', parent: null, '@parent': true },
                {
                    id: '6',
                    title: 'Working out',
                    parent: null,
                    '@parent': false,
                },
                {
                    id: '7',
                    title: 'Assignment for accounting',
                    parent: '1',
                    '@parent': false,
                },
                {
                    id: '8',
                    title: 'Assignment for delivery',
                    parent: '1',
                    '@parent': false,
                },
                {
                    id: '9',
                    title: 'Assignment for logisticians',
                    parent: '1',
                    '@parent': false,
                },
                { id: '10', title: 'Job journal', parent: '5' },
                { id: '11', title: 'Telephony', parent: '5' },
            ],
        });
    }
}
