import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterView/Source/AdditionalTemplateProperty/AdditionalTemplateProperty';
import 'Controls-demo/FilterOld/FilterPopup/resources/HistorySourceDemo';
import { getItems } from 'Controls-demo/FilterOld/FilterPopup/resources/FilterItemsStorage';
import { SyntheticEvent } from 'Vdom/Vdom';
import { object } from 'Types/util';
import 'css!Controls-demo/FilterOld/FilterPopup/DetailPanel/Filter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = getItems();
    }

    protected _itemsChangedHandler(event: SyntheticEvent, items: unknown[]): void {
        this._source = object.clone(items);
    }
}
