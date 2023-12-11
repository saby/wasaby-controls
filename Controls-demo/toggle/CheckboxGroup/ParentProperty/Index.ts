import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/ParentProperty/Template');

const SELECTED_KEYS = ['4', '5', '9'];

export default class ParentProperty extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: string[] = SELECTED_KEYS;
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: '1',
                title: 'Item 1',
                parent: null,
                node: false,
            },
            {
                id: '2',
                title: 'Item 2',
                parent: null,
                node: true,
            },
            {
                id: '3',
                title: 'child 1',
                parent: '2',
                node: false,
            },
            {
                id: '4',
                title: 'child 2',
                parent: '2',
                node: false,
            },
            {
                id: '5',
                title: 'child 3',
                parent: '2',
                node: false,
            },
            {
                id: '6',
                title: 'Item 3',
                parent: null,
                node: false,
            },
            {
                id: '7',
                title: 'Item 4',
                parent: null,
                node: true,
            },
            {
                id: '8',
                title: 'child 1',
                parent: '7',
                node: false,
            },
            {
                id: '9',
                title: 'child 2',
                parent: '7',
                readOnly: true,
                node: false,
            },
            {
                id: '10',
                title: 'child 3',
                parent: '7',
                node: false,
            },
        ],
    });
}
