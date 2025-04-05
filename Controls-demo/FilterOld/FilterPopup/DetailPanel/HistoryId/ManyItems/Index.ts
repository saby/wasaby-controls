import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterPopup/DetailPanel/HistoryId/ManyItems/ManyItems';
import 'Controls-demo/FilterOld/FilterPopup/resources/HistorySourceDemo';
import { getHistoryItems } from 'Controls-demo/FilterOld/FilterPopup/resources/FilterItemsStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = getHistoryItems();
    }

    static _styles: string[] = ['Controls-demo/FilterOld/FilterPopup/DetailPanel/Filter'];
}
