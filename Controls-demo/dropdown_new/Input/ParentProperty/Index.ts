import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/ParentProperty/Index');
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: number[] = [2];
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Assignment', parent: null, '@parent': true },
                {
                    key: 2,
                    title: 'Task in development',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: 3,
                    title: 'Error in development',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: 4,
                    title: 'Application',
                    parent: null,
                    '@parent': false,
                },
                { key: 5, title: 'Approval', parent: null, '@parent': false },
                {
                    key: 6,
                    title: 'Working out',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: 7,
                    title: 'Assignment for accounting',
                    parent: 1,
                    '@parent': false,
                },
                {
                    key: 8,
                    title: 'Assignment for delivery',
                    parent: 1,
                    '@parent': false,
                },
                {
                    key: 9,
                    title: 'Assignment for logisticians',
                    parent: 1,
                    '@parent': false,
                },
            ],
        });
    }

    protected _dataLoadCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _selectedKeysChanged(event: Event, selectedKeys: string[]): boolean {
        const item = this._items.getRecordById(selectedKeys[0]);
        if (item.get('@parent')) {
            return false;
        }
    }
}
