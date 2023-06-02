import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../../list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/tileNew/ItemActions/CustomPosition/CustomPosition';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData().map((item) => {
                return {
                    ...item,
                    width: 300,
                };
            }),
        });
    }

    static _styles: string[] = [
        'Controls-demo/tileNew/ItemActions/CustomPosition/CustomPosition',
    ];
}
