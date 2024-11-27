import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { NodeState } from '../data/NodeState';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import * as Template from 'wml!Controls-demo/tree/OnCollapsedItemsChanged/OnCollapsedItemsChanged';

function getData() {
    return NodeState.getDataCollapsedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    protected _onCollapsedItemsChanged(
        event: SyntheticEvent,
        collapsedItems: CrudEntityKey[]
    ): void {
        // Use Slice _beforeApplyState instead. see CustomFactory from this demo.
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls-demo/tree/OnCollapsedItemsChanged/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'nodeType',
                    expandedItems: [null],
                    collapsedItems: [],
                },
            },
        };
    }
}
