import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/ItemsSpacing/Template');
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItemsWithoutToolButton(),
        });
    }
}

export default Base;
