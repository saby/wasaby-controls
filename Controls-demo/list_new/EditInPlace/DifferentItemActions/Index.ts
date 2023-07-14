import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/DifferentItemActions/DifferentItemActions';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import { showType } from 'Controls/toolbars';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return getFewCategories().slice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _itemActions: IItemAction[] = getItemActions();

    protected _itemActionVisibilityCallback(
        action: IItemAction,
        item: Model,
        isEditing: boolean
    ): boolean {
        if (isEditing) {
            return action.id === 2 || action.showType === showType.MENU;
        } else {
            return true;
        }
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceDifferentItemActions: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
