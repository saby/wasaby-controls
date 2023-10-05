/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { TKey, TSelectionViewMode } from 'Controls/interface';
import * as rk from 'i18n!Controls';
import { showType } from 'Controls/toolbars';

const SHOW_SELECTED_ITEM = {
    id: 'showSelected',
    command: 'selected',
    title: rk('Отобрать отмеченные'),
};

const SHOW_ALL_ITEM = {
    id: 'showAll',
    command: 'all',
    title: rk('Показать все'),
};

const SHOW_INVERT_ITEM = {
    id: 'toggleSelection',
    command: 'toggleAll',
    showType: showType.MENU_TOOLBAR,
    title: rk('Инвертировать'),
};

const SHOW_SELECT_COUNT = [
    {
        id: 'count-10',
        command: 'count-10',
        title: '10',
    },
    {
        id: 'count-25',
        command: 'count-25',
        title: '25',
    },
    {
        id: 'count-50',
        command: 'count-50',
        title: '50',
    },
    {
        id: 'count-100',
        command: 'count-100',
        title: '100',
    },
    {
        id: 'count-500',
        command: 'count-500',
        title: '500',
    },
    {
        id: 'count-1000',
        command: 'count-1000',
        title: '1000',
    },
];

const SELECT_ALL_ITEM = {
    id: 'selectAll',
    command: 'selectAll',
    title: rk('Все'),
};

const SHOW_SELECT_COUNT_SELECTED_ITEMS = [
    {
        id: 'count-10',
        command: 'count-10',
        title: '+10',
    },
    {
        id: 'count-25',
        command: 'count-25',
        title: '+25',
    },
    {
        id: 'count-50',
        command: 'count-50',
        title: '+50',
    },
    {
        id: 'count-100',
        command: 'count-100',
        title: '+100',
    },
    {
        id: 'count-500',
        command: 'count-500',
        title: '+500',
    },
    {
        id: 'count-1000',
        command: 'count-1000',
        title: '+1000',
    },
];
const UNSELECT_ALL_ITEM = {
    id: 'unselectAll',
    command: 'unselectAll',
    title: rk('Снять'),
};

interface IMultiSelectorMenuItem {
    id: string;
    title: string;
}

export function getAdditionalItems(
    selectionViewMode: TSelectionViewMode,
    isAllSelected: boolean,
    selectedKeys: TKey[] = [],
    selectedKeysCount: number | null
): IMultiSelectorMenuItem[] {
    const items = [];
    const hasSelected =
        !!selectedKeys.length && (selectedKeysCount > 0 || selectedKeysCount === null);

    if (selectionViewMode !== 'selected') {
        items.push({ ...SELECT_ALL_ITEM });
    }
    items.push({ ...UNSELECT_ALL_ITEM });
    if (selectionViewMode === 'selected') {
        items.push({ ...SHOW_ALL_ITEM });
        // Показываем кнопку если есть выбранные и невыбранные записи
    }

    if (selectionViewMode !== 'partial') {
        items.push({ ...SHOW_INVERT_ITEM });
    }

    if (!isAllSelected) {
        if ((selectionViewMode === 'all' || selectionViewMode === 'selected') && hasSelected) {
            items.push({ ...SHOW_SELECTED_ITEM });
        } else if (selectionViewMode === 'partial') {
            if (hasSelected) {
                items.push(...SHOW_SELECT_COUNT_SELECTED_ITEMS);
            } else {
                items.push(...SHOW_SELECT_COUNT);
            }
        }
    }

    return items;
}
