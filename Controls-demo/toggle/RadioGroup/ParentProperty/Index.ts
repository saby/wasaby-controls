import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/toggle/RadioGroup/ParentProperty/Template';
import { RecordSet } from 'Types/collection';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey: number = 4;
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: 1,
                title: 'Item 1',
                parent: null,
                node: false,
            },
            {
                key: 2,
                title: 'Item 2',
                parent: null,
                node: true,
            },
            {
                key: 3,
                title: 'Child 1',
                parent: 2,
                node: false,
            },
            {
                key: 4,
                title: 'Child 2',
                parent: 2,
                node: false,
            },
            {
                key: 5,
                title: 'Child 3',
                parent: 2,
                node: false,
            },
            {
                key: 6,
                title: 'Item 3',
                parent: null,
                node: false,
            },
            {
                key: 7,
                title: 'Item 4',
                parent: null,
                node: false,
            },
        ],
    });
}
export default ViewModes;
