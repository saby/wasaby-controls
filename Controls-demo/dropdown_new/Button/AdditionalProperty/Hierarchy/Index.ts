import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/AdditionalProperty/Hierarchy/Index');
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _itemsHierarchy: RecordSet;

    protected _beforeMount(): void {
        this._itemsHierarchy = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Task',
                    '@parent': true,
                    parent: null,
                },
                {
                    id: 2,
                    title: 'Error in the development',
                    '@parent': false,
                    parent: null,
                },
                { id: 3, title: 'Commission', parent: 1 },
                {
                    id: 4,
                    title: 'Coordination',
                    parent: 1,
                    '@parent': true,
                },
                { id: 5, title: 'Application', parent: 1 },
                { id: 6, title: 'Development', parent: 1, additional: true },
                { id: 7, title: 'Exploitation', parent: 1, additional: true },
                { id: 8, title: 'Coordination', parent: 4 },
                { id: 9, title: 'Negotiate the discount', parent: 4 },
                { id: 10, title: 'Coordination of change prices', parent: 4, additional: true },
                { id: 11, title: 'Matching new dish', parent: 4, additional: true },
            ],
        });
    }
}
