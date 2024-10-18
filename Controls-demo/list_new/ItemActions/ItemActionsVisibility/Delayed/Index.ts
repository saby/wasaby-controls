import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsVisibility/Delayed/ItemActions';

import { menuToolbarItemActions, srcData } from '../resources';

function getData() {
    return srcData;
}

export default class ListDelayedItemActions extends Control<IControlOptions> {
    protected _itemActions: IItemAction[] = menuToolbarItemActions;
    protected _template: TemplateFunction = template;
    protected _itemActionsVisibility: string = 'delayed';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsVisibilityDelayed0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
