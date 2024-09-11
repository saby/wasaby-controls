import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/BackgroundStyle/BaackgroundStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getSearchData(true);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown[];
    protected _header: object[] = [
        {
            title: 'Наименование',
        },
        {
            title: 'Код',
        },
        {
            title: 'Цена',
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
