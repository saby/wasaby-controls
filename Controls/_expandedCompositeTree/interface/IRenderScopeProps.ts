import type { TemplateFunction } from 'UI/Base';
import type { TreeTileCollection } from 'Controls/treeTile';
import type { IItemPadding, IEditingConfig } from 'Controls/display';
import { IItemActionsOptions } from 'Controls/itemActions';

export interface IRenderScopeProps extends IItemActionsOptions {
    itemPadding: IItemPadding;
    itemsContainerPadding: IItemPadding;
    footerTemplate: TemplateFunction;
    footerTemplateOptions: object;
    itemTemplate: TemplateFunction;
    itemTemplateOptions: object;
    listModel: TreeTileCollection;
    orientation: string;
    editingConfig: IEditingConfig;
}
