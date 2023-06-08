import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/RoundBorder/3xs/3xs';

import { Gadgets } from '../../../../DataHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _roundBorder: object = {
        tl: '3xs',
        tr: '3xs',
        br: '3xs',
        bl: '3xs',
    };

    protected _itemActions: IItemAction[] = Gadgets.getPreviewActions();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems(),
        });
    }
}
