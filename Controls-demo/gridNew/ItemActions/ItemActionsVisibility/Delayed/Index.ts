import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { IColumn } from 'Controls/grid';
import { Memory } from 'Types/source';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as template from 'wml!Controls-demo/gridNew/ItemActions/ItemActionsVisibility/Delayed/ItemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXINDEX = 4;

function getData() {
    return Countries.getData().slice(1, MAXINDEX);
}

export default class ListDelayedItemActions extends Control<IControlOptions> {
    protected _itemActions: IItemAction[] = getItemActions();
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _itemActionsVisibility: string = 'delayed';
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths();

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
