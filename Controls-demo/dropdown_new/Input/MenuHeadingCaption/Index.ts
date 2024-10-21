import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/MenuHeadingCaption/Index');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/dropdown_new/Input/Index';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _selectedKeys: number[] = [1];

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
                    title: 'News',
                },
            ],
        });
    }
}
