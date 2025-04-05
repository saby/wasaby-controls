import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionVisibilityCallback/ItemActionVisibilityCallback';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionVisibilityCallback: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _itemActionVisibilityCallback(itemAction: IItemAction, item: Model): boolean {
        if (itemAction.title === 'Позвонить') {
            return false;
            // eslint-disable-next-line
        } else if (itemAction.showType === TItemActionShowType.MENU && itemAction.id === 6) {
            return false;
        }

        const itemId = item.getKey();
        // eslint-disable-next-line
        return !(
            (itemId === '"0"' || itemId === 2) &&
            (itemAction.showType === TItemActionShowType.MENU ||
                itemAction.showType === TItemActionShowType.MENU_TOOLBAR)
        );
    }
}
