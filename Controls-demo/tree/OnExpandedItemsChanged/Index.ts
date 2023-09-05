import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import * as Template from 'wml!Controls-demo/tree/OnExpandedItemsChanged/OnExpandedItemsChanged';
import { NodeState } from 'Controls-demo/tree/data/NodeState';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return NodeState.getDataExpandedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _onExpandedItemsChanged(event: SyntheticEvent, expandedItems: CrudEntityKey[]): void {
        // Use Slice _beforeApplyState instead. see CustomFactory from this demo.
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls-demo/tree/OnExpandedItemsChanged/CustomFactory',
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
