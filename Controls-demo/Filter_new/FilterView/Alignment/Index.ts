import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/Alignment/Index';
import 'Controls-demo/Filter_new/resources/HistorySourceDemo';
import { getItems } from 'Controls-demo/Filter_new/resources/FilterItemsStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = getItems();
    }
    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
