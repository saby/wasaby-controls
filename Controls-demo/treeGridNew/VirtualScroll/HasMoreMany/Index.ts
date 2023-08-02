import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/HasMoreMany/HasMoreMany';
import { HierarchicalMemory as Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = VirtualScrollHasMore.getColumns();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: VirtualScrollHasMore.getData(),
        });
    }
}
