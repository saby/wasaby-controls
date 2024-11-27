import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/GroupProperty/Simple/Index');
import { RecordSet } from 'Types/collection';
import { groupConstants } from 'Controls/display';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'Project', group: groupConstants.hiddenGroup },
                { key: 2, title: 'Work plan', group: groupConstants.hiddenGroup },
                { key: 3, title: 'Task', group: groupConstants.hiddenGroup },
                { key: 4, title: 'Merge request', group: 'Create' },
                { key: 5, title: 'Meeting', group: 'Create' },
                { key: 6, title: 'Video meeting', group: 'Create' },
            ],
            keyProperty: 'key',
        });
    }
}
