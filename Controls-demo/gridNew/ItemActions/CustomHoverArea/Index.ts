import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { TColspanCallbackResult } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/gridNew/ItemActions/CustomHoverArea/CustomHoverArea';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXINDEX = 4;

function getData() {
    return Countries.getData().slice(1, MAXINDEX);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[] = getItemActions();

    protected _colspanCallback(): TColspanCallbackResult {
        return 'end';
    }

    static _styles: string[] = [
        'Controls-demo/gridNew/ItemActions/CustomHoverArea/CustomHoverArea',
    ];

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
}
