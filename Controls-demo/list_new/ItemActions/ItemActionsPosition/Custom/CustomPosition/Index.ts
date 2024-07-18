import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/CustomPosition/CustomPosition';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getContactsCatalog as getData } from '../../../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../../../DemoHelpers/ItemActionsCatalog';
import 'css!Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/CustomPosition/CustomPosition';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsPositionCustomCustomPosition0: {
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
}
