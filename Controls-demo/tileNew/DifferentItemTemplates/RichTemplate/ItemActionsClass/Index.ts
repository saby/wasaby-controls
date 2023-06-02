import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ItemActionsClass/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-DownloadNew',
            title: 'download',
            showType: TItemActionShowType.MENU,
        },
        {
            id: 2,
            icon: 'icon-Signature',
            title: 'signature',
            showType: TItemActionShowType.MENU,
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems().slice(2, 4),
        });
    }
}
