import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ItemActions/All/All';
import { Memory } from 'Types/source';
import {
    getActionsForContacts as getItemActions,
    getMoreActions,
} from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(1, 4);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths().map((cur, i) => {
        // eslint-disable-next-line
        if (i === 5) {
            return {
                ...cur,
                width: '350px',
            };
        }
        return cur;
    });
    protected _itemActions: IItemAction[] = [...getItemActions(), ...getMoreActions()];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsAll1: {
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
