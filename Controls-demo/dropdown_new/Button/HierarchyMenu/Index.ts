import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dropdown_new/Button/HierarchyMenu/Index';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: 1,
                    title: 'Task',
                    '@parent': true,
                    parent: null,
                },
                {
                    key: 2,
                    title: 'Error in the development',
                    '@parent': false,
                    parent: null,
                },
                { key: 3, title: 'Commission', parent: 1 },
                {
                    key: 4,
                    title: 'Coordination',
                    parent: 1,
                    '@parent': true,
                },
                { key: 5, title: 'Application', parent: 1 },
                { key: 6, title: 'Development', parent: 1 },
                { key: 7, title: 'Exploitation', parent: 1 },
                { key: 8, title: 'Coordination', parent: 4 },
                { key: 9, title: 'Negotiate the discount', parent: 4 },
                { key: 10, title: 'Coordination of change prices', parent: 4 },
                { key: 11, title: 'Matching new dish', parent: 4 },
            ],
        });
    }

    protected _menuItemActivate(event: Event, item: Model): boolean {
        return !item.get('@parent');
    }
}
