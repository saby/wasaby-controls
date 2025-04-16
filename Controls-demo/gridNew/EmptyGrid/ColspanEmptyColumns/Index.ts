import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/ColspanEmptyColumns/ColspanEmptyColumns';
import { Memory } from 'Types/source';
import { TColumns } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: TColumns = Countries.getColumnsWithFixedWidths();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EmptyGridColspanEmptyColumns: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
            EmptyGridColspanEmptyColumns1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
