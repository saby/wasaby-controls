import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/GroupProperty/TextAlign/Index');
import { RecordSet } from 'Types/collection';

class GroupTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'Project', group: 'Select' },
                { key: 2, title: 'Work plan', group: 'Select' },
                { key: 3, title: 'Task', group: 'Select' },
                { key: 4, title: 'Merge request', group: 'Create' },
                { key: 5, title: 'Meeting', group: 'Create' },
                { key: 6, title: 'Video meeting', group: 'Create' },
            ],
            keyProperty: 'key',
        });
    }
}
export default GroupTemplate;
