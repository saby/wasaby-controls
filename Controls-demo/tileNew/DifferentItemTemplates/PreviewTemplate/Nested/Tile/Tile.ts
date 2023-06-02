import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/ShowType/ShowType';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[] = Gadgets.getPreviewActions();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems().slice(5, 6),
        });
    }
}
