import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/EmptyText/WithSimplePanel/WithSimplePanel';
import { getItems } from 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/FilterItemsStorage';
import { SyntheticEvent } from 'Vdom/Vdom';
import { object } from 'Types/util';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = getItems();
    }

    protected _itemsChangedHandler(
        event: SyntheticEvent,
        items: unknown[]
    ): void {
        this._source = object.clone(items);
    }
}
