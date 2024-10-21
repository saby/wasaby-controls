import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../../list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/tileNew/ItemActions/CustomPositionComponent/CustomPositionComponent';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getData().map((item) => {
        return {
            ...item,
            width: 300,
        };
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();

    static _styles: string[] = [
        'Controls-demo/tileNew/ItemActions/CustomPositionComponent/CustomPositionComponent',
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsCustomPositionComponent: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
