import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/2xs/2xs';

import {
    DATA,
    ITEM_ACTIONS,
} from 'Controls-demo/tileNew/DataHelpers/RichTemplate';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[];
    protected _roundBorder: object = {
        tl: '2xs',
        tr: '2xs',
        br: '2xs',
        bl: '2xs',
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: DATA,
        });
        this._itemActions = ITEM_ACTIONS;
    }
}
