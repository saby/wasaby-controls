import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/HintTextProperty/Template');
import { RecordSet } from 'Types/collection';
import { object } from 'Types/util';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        const items = object.clone(data.getDefaultItemsWithoutToolButton()).map((item) => {
            item.hintText = `это подсказка у элемента ${item.id}`;
            item.iconStyle = undefined;
            if (item.id === '1') {
                item.iconStyle = 'danger';
            }
            return item;
        });
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: items,
        });
    }
}

export default Base;
