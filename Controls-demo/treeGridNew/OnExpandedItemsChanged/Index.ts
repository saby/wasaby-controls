import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnExpandedItemsChanged/OnExpandedItemsChanged';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Events.getDataExpandedItemsChanged();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Events.getColumns();
    protected _expandedItems: CrudEntityKey[] = [];
    protected _collapsedItems: CrudEntityKey[];

    protected _onExpandedItemsChanged(event: SyntheticEvent, expandedItems: CrudEntityKey[]): void {
        const allowedToExpandItemKeys: CrudEntityKey[] = [];
        expandedItems.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToExpandItemKeys.push(itemKey);
        });
        this._expandedItems = allowedToExpandItemKeys;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                        filter: (): boolean => {
                            return true;
                        },
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'nodeType',
                    expandedItems: []
                },
            },
        };
    }
}
