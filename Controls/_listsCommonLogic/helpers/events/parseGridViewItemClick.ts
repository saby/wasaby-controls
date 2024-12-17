import {
    TParseItemClickParams,
    TParseItemClickHandlers,
    isCheckboxClick,
    isGroupItem,
    TItem,
} from './parseItemClick';
import parseListViewItemClick from './parseListViewItemClick';
import type { CollectionItem } from 'Controls/display';

// TODO: Эта функция должна быть удалена в рамках проекта, она существует только потому
//  что код обработки клика во всех вьюхах по логике должен и частично делает одно и то-же,
//  но написан по разному. От этого возможны ошибки, на которые сейчас не хватает рессурсов.
//  Вероятно октябрь-ноябрь 23г.
export default function parseGridViewItemClick<T extends TItem = CollectionItem>(
    params: TParseItemClickParams<T>,
    handlers: TParseItemClickHandlers<T>
): void {
    if (params.cleanScheme) {
        parseListViewItemClick(params, handlers);
        return;
    }

    if (isCheckboxClick(params.event)) {
        handlers.onCheckbox?.(params.event, params.item);
        return;
    }

    if (isGroupItem(params.event, params.item)) {
        handlers.onGroup?.(params.event, params.item);
        return;
    }

    handlers.onItem?.(params.event, params.item);
}
