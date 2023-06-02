import { Control, TemplateFunction } from 'UI/Base';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMenuViewMode/Menu/Menu';

/**
 * Демка для статьи https://wi.sbis.ru/docs/js/Controls/tile/View/options/actionMenuViewMode/?v=22.1100
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _itemActions: any[] = Gadgets.getPreviewActions();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems().slice(5, 6),
        });
    }
}
