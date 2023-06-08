import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/DetailPanel/GroupProperty/GroupProperty';
import { getItemsWithGroup } from 'Controls-demo/Filter_new/resources/FilterItemsStorage';
import { IFilterItem } from 'Controls/filter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: unknown[] = [];

    private _resolveTemplates(items: IFilterItem[]): Promise<unknown> {
        const resultTemplates = [];
        items.forEach((item) => {
            if (item.additionalTemplate) {
                resultTemplates.push(import(item.additionalTemplate));
            }
            if (item.itemTemplate) {
                resultTemplates.push(import(item.itemTemplate));
            }
        });
        return Promise.all(resultTemplates).then(() => {
            return null;
        });
    }

    protected _beforeMount(): Promise<unknown> {
        this._items = getItemsWithGroup();
        return this._resolveTemplates(this._items as IFilterItem[]);
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
