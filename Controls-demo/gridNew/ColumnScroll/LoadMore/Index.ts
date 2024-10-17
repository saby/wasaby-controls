import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/LoadMore/LoadMore';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = Countries.getHeader();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollLoadMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'pages',
                        sourceConfig: {
                            pageSize: 5,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'pagingMode',
                        },
                    },
                },
            },
        };
    }
}
