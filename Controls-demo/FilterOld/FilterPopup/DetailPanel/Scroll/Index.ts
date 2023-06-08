import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterPopup/DetailPanel/Scroll/Scroll';
import { getItems } from 'Controls-demo/FilterOld/FilterPopup/resources/FilterItemsStorage';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';
import { object } from 'Types/util';
import { constants } from 'Env/Env';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];
    protected _resourceRoot: string = constants.resourceRoot;
    protected _listItems1: object[] = [];
    protected _listItems2: object[] = [];
    protected _listViewSource1: Memory = null;
    protected _listViewSource2: Memory = null;

    protected _beforeMount(): void {
        this._source = getItems();
        const itemsCount = 20;
        for (let i = 0; i < itemsCount; i++) {
            this._listItems1.push({
                key: i,
            });
            this._listItems2.push({
                key: itemsCount + i,
            });
        }
        this._listViewSource1 = new Memory({
            keyProperty: 'key',
            data: this._listItems1,
        });

        this._listViewSource2 = new Memory({
            keyProperty: 'key',
            data: this._listItems2,
        });
    }
    protected _itemsChangedHandler(event: SyntheticEvent, items: unknown[]): void {
        this._source = object.clone(items);
    }

    static _styles: string[] = ['Controls-demo/FilterOld/FilterPopup/DetailPanel/Filter'];
}
