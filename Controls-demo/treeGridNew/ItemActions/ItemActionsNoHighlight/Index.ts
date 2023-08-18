import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemActions/ItemActionsNoHighlight/ItemActionsNoHighlight';
import { HierarchicalMemory } from 'Types/source';
import { getActionsForContacts as getItemActions } from '../../../list_new/DemoHelpers/ItemActionsCatalog';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
            width: '200px',
        },
        {
            displayProperty: 'rating',
            width: '150px',
        },
        {
            displayProperty: 'country',
            width: '350px',
        },
    ];
    protected _itemActions: IItemAction[] = getItemActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsNoHighlight: {
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
