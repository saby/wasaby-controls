import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getActionsWithViewMode as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemActions/viewMode/viewMode';

function getData() {
    return [
        {
            key: 'record_0',
            title: 'Различные режимы отображения операций над записью размер s',
            itemActions: getItemActions().map((action) => {
                return { ...action, iconSize: 's' };
            }),
        },
        {
            key: 'record_1',
            title: 'Различные режимы отображения операций над записью размер m',
            itemActions: getItemActions().map((action) => {
                return { ...action, iconSize: 'm' };
            }),
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _clickedAction: string;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsviewMode: {
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

    _onActionClick(event: SyntheticEvent, action: IItemAction, item: Model): void {
        this._clickedAction = action.title;
    }
}
