import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/HierarchyViewMode/Index';
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _dataLoadCallback: Function;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];
    protected _excludedKeys: string[] = [];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
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
                { id: 6, title: 'Development', parent: 1 },
                { id: 7, title: 'Exploitation', parent: 1 },
                { id: 8, title: 'Coordination', parent: 4 },
                { id: 9, title: 'Negotiate the discount', parent: 4 },
                { id: 10, title: 'Coordination of change prices', parent: 4 },
                { id: 11, title: 'Matching new dish', parent: 4 },
                {
                    id: 12,
                    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    parent: 1,
                    '@parent': true,
                },
                { id: 13, title: 'Nullam in nisi', parent: 12 },
            ],
        });
    }
}
