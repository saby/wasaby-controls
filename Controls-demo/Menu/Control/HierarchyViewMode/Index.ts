import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/HierarchyViewMode/Index');
import { Memory } from 'Types/source';

class Source extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                { key: 1, title: 'Task', node: true, parent: null },
                {
                    key: 2,
                    title: 'Error in the development',
                    node: false,
                    parent: null,
                },
                { key: 3, title: 'Commission', parent: 1 },
                { key: 4, title: 'Coordination', parent: 1, node: true },
                { key: 5, title: 'Application', parent: 1 },
                { key: 6, title: 'Development', parent: 1 },
                { key: 7, title: 'Exploitation', parent: 1 },
                { key: 8, title: 'Coordination', parent: 4 },
                { key: 9, title: 'Negotiate the discount', parent: 4 },
            ],
            keyProperty: 'key',
        });
    }
}
export default Source;
