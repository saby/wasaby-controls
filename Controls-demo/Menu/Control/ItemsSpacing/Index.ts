import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Menu/Control/ItemsSpacing/Index';
import { RecordSet } from 'Types/collection';

class Source extends Control {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    key: 1,
                    title: 'Administrator',
                    icon: 'icon-AdminInfo',
                },
                { key: 2, title: 'Moderator' },
                { key: 3, title: 'Participant' },
                {
                    key: 4,
                    title: 'Subscriber',
                    icon: 'icon-Subscribe',
                },
            ],
            keyProperty: 'key',
        });
    }
}
export default Source;
