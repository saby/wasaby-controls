import { showType } from 'Controls/toolbars';

export const MOVE_DOWN_ACTION = 'moveDown';
export const MOVE_UP_ACTION = 'moveUp';
export const MIN_STACK_WIDTH = 450;
export const MAX_STACK_WIDTH = 1400;
export const SEARCH_PARAM = 'searchValue';

export const ITEM_ACTIONS = [
    {
        id: MOVE_UP_ACTION,
        icon: 'icon-ArrowUp',
        iconStyle: 'secondary',
        tooltip: 'Переместить вверх',
        title: 'Переместить вверх',
        showType: showType.MENU,
    },
    {
        id: MOVE_DOWN_ACTION,
        icon: 'icon-ArrowDown',
        iconStyle: 'secondary',
        tooltip: 'Переместить вниз',
        title: 'Переместить вниз',
        showType: showType.MENU,
    },
    {
        id: 'delete',
        icon: 'icon-Erase',
        iconStyle: 'danger',
        tooltip: 'Удалить',
        title: 'Удалить',
        showType: showType.MENU_TOOLBAR,
    },
];
