import * as Template from 'wml!Controls-demo/treeGridNew/ItemsView/Multiselection/Index';
import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _columns: unknown[] = Flat.getColumns();

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: Flat.getData(),
        });
    }
}
