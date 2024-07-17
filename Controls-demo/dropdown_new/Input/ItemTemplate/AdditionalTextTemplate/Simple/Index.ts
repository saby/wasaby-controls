import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line max-len
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/ItemTemplate/AdditionalTextTemplate/Simple/Index');
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Subdivision',
                },
                {
                    key: 2,
                    title: 'Separate unit',
                    icon: 'icon-Company',
                    node: true,
                    comment:
                        'A territorially separated subdivision with its own address. For him, you can specify a legal entity',
                    number: '123',
                },
                { key: 21, title: 'Development', parent: 2 },
                { key: 22, title: 'Exploitation', parent: 2 },
                { key: 23, title: 'Coordination', parent: 2 },
                {
                    key: 3,
                    title: 'Working group',
                    iconStyle: 'secondary',
                    icon: 'icon-Groups',
                    comment:
                        'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office',
                },
            ],
        });
    }
}
