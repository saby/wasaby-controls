import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/RowSeparator/WithHeaderAndResults/WithHeaderAndResults';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';

function getData() {
    return Flat.getShortData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumnsWithLargeWidth();
    protected _header: IHeaderCell[] = Flat.getHeader();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RowSeparatorWithHeaderAndResults: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/RowSeparator/WithHeaderAndResults/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
