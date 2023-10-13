import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/MenuBackgroundStyle/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedTitle: string = '';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    title: 'Message',
                },
                {
                    key: '2',
                    title: 'Report',
                },
                {
                    key: '3',
                    title: 'Task',
                },
                {
                    key: '4',
                    title: 'News',
                },
                {
                    key: null,
                    title: 'Note',
                },
            ],
        });
    }
    protected _menuItemActivate(event: Event, item: Model): void {
        this._selectedTitle = item.get('title');
    }
}
