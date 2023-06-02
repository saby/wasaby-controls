import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { groupConstants } from 'Controls/list';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/GroupProperty/GroupProperty';

interface IGroupedItemActions extends IItemAction {
    group: string;
}

const groupedItemActions: IGroupedItemActions[] = [
    {
        id: 1,
        title: 'Прочитано',
        showType: TItemActionShowType.MENU,
        group: groupConstants.hiddenGroup,
    },
    {
        id: 7,
        title: 'Удалить',
        showType: TItemActionShowType.MENU,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        group: groupConstants.hiddenGroup,
    },
    {
        id: 6,
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
        showType: TItemActionShowType.MENU,
        group: 'beneathSeparator',
    },
    {
        id: 2,
        icon: 'icon-PhoneNull',
        title: 'Позвонить',
        showType: TItemActionShowType.MENU,
        group: 'beneathSeparator',
    },
    {
        id: 3,
        icon: 'icon-EmptyMessage',
        title: 'Написать',
        showType: TItemActionShowType.MENU,
        group: 'beneathSeparator',
    },
    {
        id: 4,
        icon: 'icon-Chat',
        title: 'Диалог',
        showType: TItemActionShowType.MENU,
        group: 'beneathSeparator',
    },
    {
        id: 5,
        icon: 'icon-Email',
        title: 'Email',
        showType: TItemActionShowType.MENU,
        group: 'beneathSeparator',
    },
];

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/context-menu-config/#group
 */
export default class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _itemActions: IGroupedItemActions[] = groupedItemActions;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Операции в меню разделены по группам',
                },
            ],
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
