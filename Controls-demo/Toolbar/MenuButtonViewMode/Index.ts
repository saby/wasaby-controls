import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Toolbar/MenuButtonViewMode/Template';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItems(),
        });
    }
}

export default Base;
