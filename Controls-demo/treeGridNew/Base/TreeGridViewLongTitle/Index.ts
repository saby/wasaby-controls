import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Base/TreeGridViewLongTitle/TreeGridViewLongTitle';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';

function getData() {
    const data = Flat.getData();
    const { title } = data[0];
    data[0].title = `${title} ${title} ${title} ${title}`;
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _columnsOverflow: IColumn[] = Array.from(Flat.getColumns()).map((item) => {
        return {
            ...item,
            textOverflow: 'ellipsis',
        };
    });

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BaseTreeGridViewLongTitle: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
            BaseTreeGridViewLongTitle1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
