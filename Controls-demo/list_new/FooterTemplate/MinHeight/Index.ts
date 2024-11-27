import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/FooterTemplate/MinHeight/MinHeight';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import 'css!Controls-demo/list_new/FooterTemplate/MinHeight/MinHeight';
import 'css!Controls/CommonClasses';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FooterTemplateMinHeight: {
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
