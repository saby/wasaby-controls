import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IColumn } from 'Controls/grid';
import { Memory } from 'Types/source';

import * as template from 'wml!Controls-demo/gridNew/ItemActions/ItemActionsVisibility/Delayed/ItemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

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

export default class ListDelayedItemActions extends Control<IControlOptions> {
    protected _itemActions: IItemAction[] = itemActions;
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _itemActionsVisibility: string = 'visible';
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths();

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(1, MAXINDEX),
        });
    }
}
