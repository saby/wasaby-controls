import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/Align/Align';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EmptyGridAlign: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
        };
    }
}
