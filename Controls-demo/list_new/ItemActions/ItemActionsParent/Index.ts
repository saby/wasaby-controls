import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsParent/ItemActionsParent';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { getContactsCatalog as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

/**
 * Для документации https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/#hierarchy-support
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsParent: {
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

    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 1,
                title: 'Show',
                showType: TItemActionShowType.MENU,
                parent: null,
                'parent@': false,
            },
            {
                id: 2,
                title: 'Edit',
                showType: TItemActionShowType.MENU,
                parent: null,
                'parent@': true,
            },
            {
                id: 3,
                title: 'Edit description',
                showType: TItemActionShowType.MENU,
                parent: 2,
                'parent@': null,
            },
        ];
    }
}
