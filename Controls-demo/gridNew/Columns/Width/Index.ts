import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Width/Width';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { CrossBrowserWidths } from 'Controls-demo/gridNew/DemoHelpers/Data/CrossbrowserWidths';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = CrossBrowserWidths;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = CrossBrowserWidths.getHeader();
    protected _columns: IColumn[] = CrossBrowserWidths.getColumns();

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
