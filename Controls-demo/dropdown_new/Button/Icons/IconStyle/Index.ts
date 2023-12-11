import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/Icons/IconStyle/Index');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    icon: 'icon-EmptyMessage',
                    iconStyle: 'info',
                    title: 'Message',
                },
                {
                    key: '2',
                    title: 'Report',
                },
                {
                    key: '3',
                    icon: 'icon-TFTask',
                    title: 'Task',
                },
                {
                    key: '4',
                    icon: 'icon-News',
                    title: 'News',
                },
                {
                    key: '5',
                    icon: 'icon-Erase',
                    iconStyle: 'danger',
                    title: 'Remove',
                },
            ],
        });
    }
}
