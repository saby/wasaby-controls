import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Toolbar/Translucent/Template';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        const itemsData = data.getItemsWithDirection();
        itemsData[0].iconStyle = 'contrast';
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: itemsData,
        });
    }
}

export default Base;
