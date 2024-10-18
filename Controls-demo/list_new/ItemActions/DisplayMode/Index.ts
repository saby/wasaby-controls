import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/DisplayMode/DisplayMode';
import { Memory } from 'Types/source';
import { getActionsWithDisplayMode } from '../../DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsDisplayMode: {
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
        this._itemActions = getActionsWithDisplayMode();
    }
}
