import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getActionsWithSVG as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemActions/SetItemActions/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];
    protected _itemActionsEnabled: boolean = false;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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

    protected _itemActionsEnabledChanged(event: SyntheticEvent, state: boolean): void {
        if (state) {
            this._itemActions = getItemActions();
        } else {
            this._itemActions = null;
        }
    }
}
