import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/Base/Template');
import { Record } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _items1: RecordSet;
    protected _items2: RecordSet;
    protected _currentClick: string;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItemsWithoutToolButton(),
        });
        this._items1 = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItems(),
        });
        this._items2 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    icon: 'icon-Print',
                    title: 'Распечатать',
                    caption: 'Распечатать',
                    viewMode: 'link',
                    readOnly: false,
                    '@parent': false,
                    parent: null,
                },
            ],
        });
    }

    protected _itemClick(e: Event, item: Record): void {
        this._currentClick = 'Вы нажали на ' + item.getId();
    }
}

export default Base;
