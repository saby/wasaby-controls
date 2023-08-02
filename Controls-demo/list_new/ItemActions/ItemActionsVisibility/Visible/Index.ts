import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsVisibility/Visible/ItemActions';

import { menuItemActions, srcData } from '../resources';

function getData() {
    return srcData;
}

export default class ListVisibleItemActions extends Control<IControlOptions> {
    protected _itemActions: IItemAction[] = menuItemActions;
    protected _template: TemplateFunction = template;
    protected _itemActionsVisibility: string = 'visible';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData2: {
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
