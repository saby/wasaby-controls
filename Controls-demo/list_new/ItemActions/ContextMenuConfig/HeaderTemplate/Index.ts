import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IoC } from 'Env/Env';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/HeaderTemplate/HeaderTemplate';

interface ISrcData {
    key: number;
    title: string;
    itemActions: IItemAction[];
}

const itemActions: IItemAction[] = [
    {
        id: 2,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'Remove',
        showType: TItemActionShowType.MENU,
    },
];

const data: ISrcData[] = [
    {
        key: 1,
        title: 'Кнопка меню будет показана, т.к. указан headerTemplate',
        itemActions,
    },
    {
        key: 2,
        title: 'Кнопка меню будет показана, т.к. указан headerTemplate',
        itemActions: [],
    },
];

export default class HeaderTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }

    static _styles: string[] = [
        'Controls-demo/list_new/ItemActions/ContextMenuConfig/HeaderTemplate/HeaderTemplate',
    ];
}
