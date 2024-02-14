import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IColumn } from 'Controls/grid';
import { Memory } from 'Types/source';

import * as template from 'wml!Controls-demo/gridNew/ItemActions/ItemActionsVisibility/Delayed/ItemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXINDEX = 4;

const itemActions: IItemAction[] = [
    {
        id: 5,
        icon: 'icon-Email',
        title: 'Email',
        showType: TItemActionShowType.MENU,
        parent: 3,
    },
    {
        id: 6,
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 7,
        title: 'Удалить',
        showType: TItemActionShowType.MENU,
        icon: 'icon-Erase',
        iconStyle: 'danger',
    },
];

function getData() {
    return Countries.getData().slice(1, MAXINDEX);
}

export default class ListDelayedItemActions extends Control<IControlOptions> {
    protected _itemActions: IItemAction[] = itemActions;
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _itemActionsVisibility: string = 'visible';
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsVisibilityVisible: {
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
