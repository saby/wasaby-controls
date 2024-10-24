import { Control, TemplateFunction } from 'UI/Base';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { dataForLadder } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/MultiLadder/MultiLadder';
import * as LadderCell from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/LadderCell';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import MyHierarchicalMemory from './DataSource';

function getData() {
    return dataForLadder;
}

const columns: IGroupNodeColumn[] = [
    {
        width: '100px',
        displayProperty: 'date',
        stickyProperty: ['date', 'parent'],
        template: LadderCell,
    },
    {
        width: '1fr',
        displayProperty: 'title',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IGroupNodeColumn[] = columns;
    protected _ladderProperties: string[] = ['date'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterMultiLadder: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new MyHierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1, 7],
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: true,
                            multiNavigation: true,
                        },
                    },
                    deepReload: true,
                },
            },
        };
    }
}
