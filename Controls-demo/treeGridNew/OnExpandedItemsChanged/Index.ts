import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnExpandedItemsChanged/OnExpandedItemsChanged';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return Events.getDataExpandedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Events.getColumns();

    protected _onExpandedItemsChanged(event: SyntheticEvent, expandedItems: CrudEntityKey[]): void {
        // Use Slice _beforeApplyState instead. see CustomFactory from this demo.
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            OnExpandedItemsChanged: {
                dataFactoryName: 'Controls-demo/treeGridNew/OnExpandedItemsChanged/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'nodeType',
                    expandedItems: [],
                },
            },
        };
    }
}
