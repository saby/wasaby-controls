import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { TColspanCallbackResult } from 'Controls/grid';

import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/list_new/ItemTemplate/CustomHoverArea/CustomHoverArea';

import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/CustomHoverArea/CustomHoverArea';
import { getFewCategories } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXINDEX = 4;

function getData() {
    return getFewCategories().slice(1, MAXINDEX);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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

    protected _colspanCallback(): TColspanCallbackResult {
        return 'end';
    }
}
