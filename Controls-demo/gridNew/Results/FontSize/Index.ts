import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Data } from 'Controls-demo/gridNew/Results/FontSize/Data';

import * as Template from 'wml!Controls-demo/gridNew/Results/FontSize/FontSize';

const { getData } = Data;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Data.getHeader();
    protected _columns: IColumn[] = Data.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFontSize: {
                dataFactoryName: 'Controls-demo/gridNew/Results/FontSize/CustomFactory',
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
