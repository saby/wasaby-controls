import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/ParentProperty/HiddenNode/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

class ParentProperty extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'Task', '@parent': false, parent: null },
                {
                    key: 2,
                    title: 'Error in the development',
                    '@parent': null,
                    parent: null,
                },
                { key: 3, title: 'Commission', parent: 1 },
                { key: 4, title: 'Coordination', parent: 1 },
                { key: 5, title: 'Application', parent: 1 },
                { key: 6, title: 'Development', parent: 1 },
                { key: 7, title: 'Exploitation', parent: 1 },
            ],
            keyProperty: 'key',
        });
    }

    protected _itemClickHandler(event: Event, item: Model): boolean {
        if (item.get('@parent')) {
            return false;
        }
    }
}
export default ParentProperty;
