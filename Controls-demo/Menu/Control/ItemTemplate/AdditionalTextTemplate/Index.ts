import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/ItemTemplate/AdditionalTextTemplate/Index');
import { RecordSet } from 'Types/collection';

class AdditionalTpl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'Subdivision' },
                {
                    key: 2,
                    title: 'Separate unit',
                    iconStyle: 'secondary',
                    icon: 'icon-Company',
                    comment:
                        'A territorially separated subdivision with its own address. For him, you can specify a legal entity',
                },
                {
                    key: 3,
                    title: 'Working group',
                    icon: 'icon-Groups',
                    comment:
                        'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office',
                },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default AdditionalTpl;
