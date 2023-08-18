import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemActions/HorizontalScroll/HorizontalScroll';
import { HierarchicalMemory } from 'Types/source';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Flat.getDataWithLargeTitle();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsHorizontalScroll: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
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
