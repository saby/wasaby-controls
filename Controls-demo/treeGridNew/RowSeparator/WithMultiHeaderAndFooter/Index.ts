import { Control, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line max-len
import * as Template from 'wml!Controls-demo/treeGridNew/RowSeparator/WithMultiHeaderAndFooter/WithMultiHeaderAndFooter';
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
            RowSeparatorWithMultiHeaderAndFooter: {
                dataFactoryName: 'Controls/dataFactory:List',
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
