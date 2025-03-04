import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/Icon/Template';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Chips 1',
                    icon: 'icon-Admin2',
                    captionPosition: 'start',
                },
                {
                    id: '2',
                    caption: 'Chips 2',
                    icon: 'icon-AdminInfo',
                    captionPosition: 'end',
                },
                {
                    id: '3',
                    caption: 'Chips 4',
                    icon: 'icon-Android',
                },
                {
                    id: '4',
                    caption: 'Chips 4',
                    icon: 'icon-Send',
                },
                {
                    id: '5',
                    caption: 'Chips 5',
                    icon: 'icon-Android',
                    iconStyle: 'success',
                },
            ],
            keyProperty: 'id',
        });
    }
}
