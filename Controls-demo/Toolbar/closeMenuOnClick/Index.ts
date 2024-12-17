import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/closeMenuOnClick/Template');
import { Record } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _currentClick: string;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItems(),
        });
    }

    protected _itemClick(e: Event, item: Record): boolean | void {
        this._currentClick = 'Вы нажали на ' + item.getId();
        if (item.getId() === '4') {
            return true;
        }
    }
}

export default Base;
