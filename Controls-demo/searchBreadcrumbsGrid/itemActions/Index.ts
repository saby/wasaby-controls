import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/itemActions/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getSearchData(true);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown[];
    protected _header: object[] = [
        {
            caption: 'Наименование',
        },
        {
            caption: 'Код',
        },
        {
            caption: 'Цена',
        },
    ];

    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            title: 'Для крошек',
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 2,
            title: 'Для листьев',
            showType: TItemActionShowType.TOOLBAR,
        },
    ];

    protected _beforeMount(): void {
        this._columns = Gadgets.getSearchColumns();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
