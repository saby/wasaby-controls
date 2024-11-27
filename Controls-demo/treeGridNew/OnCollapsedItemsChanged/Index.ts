import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnCollapsedItemsChanged/OnCollapsedItemsChanged';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return Events.getDataCollapsedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Events.getColumns();
    protected _collapsedItems: CrudEntityKey[];

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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            OnCollapsedItemsChanged: {
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
                    nodeProperty: 'nodeType',
                    expandedItems: [null],
                },
            },
        };
    }
}
