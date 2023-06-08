import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/VirtualScroll/Default/Default';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IItem {
    capital: string;
    number: number;
    country: string;
}

function getData(): IItem[] {
    let count = 0;
    return generateData({
        keyProperty: 'key',
        count: 500,
        beforeCreateItemCallback: (item: IItem) => {
            item.capital = 'South';
            item.number = count + 1;
            item.country = Countries.COUNTRIES[count];
            count++;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '200px',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 50,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'hidden',
                        },
                    },
                },
            },
        };
    }
}
