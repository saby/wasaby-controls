import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/ChangeRoot/ChangeRoot';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getColumns();
    protected _viewMode: string = 'table';
    protected _root: string | number | null = null;
    protected _itemPaddingSize: string = 's';

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData(),
        });
    }

    protected _onToggleRoot(): void {
        if (this._root === null) {
            this._root = 1;
        } else {
            this._root = null;
        }
    }

    protected _changeRootAndAdditionalOptions(): void {
        this._onToggleRoot();
        this._itemPaddingSize = this._itemPaddingSize === 's' ? 'null' : 's';
    }
}
