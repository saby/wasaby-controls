import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { NodeState } from '../data/NodeState';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import * as Template from 'wml!Controls-demo/tree/OnCollapsedItemsChanged/OnCollapsedItemsChanged';

function getData() {
    return NodeState.getDataExpandedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _collapsedItems: CrudEntityKey[] = [];

    protected _onCollapsedItemsChanged(
        event: SyntheticEvent,
        collapsedItems: CrudEntityKey[]
    ): void {
        const allowedToCollapseItemKeys: CrudEntityKey[] = [];
        collapsedItems.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToCollapseItemKeys.push(itemKey);
        });
        this._collapsedItems = allowedToCollapseItemKeys;
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
                    expandedItems: [null],
                },
            },
        };
    }
}
