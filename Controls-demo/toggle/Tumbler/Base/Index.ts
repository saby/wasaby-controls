import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Base/Template';
import { RecordSet } from 'Types/collection';

export default class Base extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                    icon: 'icon-EmptyMessage',
                },
                {
                    id: '2',
                    title: 'Item 2',
                    icon: 'icon-Email',
                },
                {
                    id: '3',
                    title: 'Item 3',
                    icon: 'icon-Edit',
                },
            ],
            keyProperty: 'id',
        });
    }
    protected _getDisabledAnimation(): boolean {
        const res = document.location.search.match(/disabledAnimation=(\d)/);
        return res ? !!+res[1] : false;
    }
}
