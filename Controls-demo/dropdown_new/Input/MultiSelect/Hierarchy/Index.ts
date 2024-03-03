import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/MultiSelect/Hierarchy/Index';
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
                    '@parent': true,
                },
                {
                    id: '61',
                    title: 'Merge request',
                    parent: '6',
                    '@parent': false,
                },
                {
                    id: '62',
                    title: 'Works on the stand',
                    parent: '6',
                    '@parent': false,
                },
                {
                    id: '63',
                    title: 'Other',
                    parent: '6',
                    '@parent': true,
                },
                {
                    id: '631',
                    title: 'Autotests',
                    parent: '63',
                    '@parent': false,
                },
                {
                    id: '632',
                    title: 'Print form',
                    parent: '63',
                    '@parent': false,
                },
                {
                    id: '633',
                    title: 'Application сode',
                    parent: '63',
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
