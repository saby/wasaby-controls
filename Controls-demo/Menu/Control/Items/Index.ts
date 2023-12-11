import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/Items/Index');
import { RecordSet } from 'Types/collection';

class Items extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _hierarchyItems: RecordSet;

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

        this._hierarchyItems = new RecordSet({
            rawData: [
                { key: 1, title: 'Task', '@parent': true, parent: null },
                {
                    key: 2,
                    title: 'Error in the development',
                    '@parent': null,
                    parent: null,
                },
                { key: 3, title: 'Commission', parent: 1 },
                { key: 4, title: 'Coordination', parent: 1, '@parent': true },
                { key: 5, title: 'Application', parent: 1 },
                { key: 6, title: 'Development', parent: 1 },
                { key: 7, title: 'Exploitation', parent: 1 },
                { key: 8, title: 'Coordination', parent: 4 },
                { key: 9, title: 'Negotiate the discount', parent: 4 },
                {
                    key: 10,
                    title: 'Coordination of change prices',
                    parent: 4,
                    '@parent': true,
                },
                { key: 11, title: 'Matching new dish', parent: 4 },
                { key: 12, title: 'New level', parent: 10 },
                { key: 13, title: 'New level record 2', parent: 10 },
                {
                    key: 14,
                    title: 'New level record 3',
                    parent: 10,
                    '@parent': true,
                },
                { key: 15, title: 'Very long hierarchy', parent: 14 },
                {
                    key: 16,
                    title: 'Very long hierarchy 2',
                    parent: 14,
                    '@parent': true,
                },
                { key: 17, title: 'Very long hierarchy 3', parent: 14 },
                { key: 18, title: 'It is last level', parent: 16 },
                { key: 19, title: 'It is last level 2', parent: 16 },
                { key: 20, title: 'It is last level 3', parent: 16 },
            ],
            keyProperty: 'key',
        });
    }
}
export default Items;
