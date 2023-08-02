import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/CellPadding/CellPadding';
import { Memory } from 'Types/source';
import { IHeaderCell } from 'Controls/grid';
import { CellPadding } from 'Controls-demo/gridNew/DemoHelpers/Data/CellPadding';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = CellPadding;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown = CellPadding.getColumns();
    protected _header: IHeaderCell[] = CellPadding.getHeader();

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
