import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Logger } from 'UI/Utils';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/NodeFooterTemplate/NodeFooterTemplate';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { TreeGridNodeFooterRow } from 'Controls/treeGrid';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterTemplate: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [null],
                },
            },
        };
    }

    protected _addButtonHandler(e: SyntheticEvent, item: TreeGridNodeFooterRow): void {
        const nodeKey = item.getNode().getContents().getKey();
        Logger.info(`Adding started for node ${nodeKey}`);
    }
}
