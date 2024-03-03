import type * as React from 'react';
import type { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

export type TItem = CollectionItem | Model | Model[];

export type TParseItemClickParams<T extends TItem> = {
    event: React.MouseEvent;
    item: T;
    cleanScheme?: boolean;
};

export type TEventNames = 'onCheckbox' | 'onGroup' | 'onItem' | 'onTag' | 'onExpander' | 'onHasMore';
export type THandler<T extends TItem> = (event: React.MouseEvent, item: T) => void;

export type TParseItemClickHandlers<T extends TItem> = Partial<Record<TEventNames, THandler<T>>>;

export const SELECTORS = {
    CHECKBOX: '.js-controls-ListView__checkbox',
    ITEM: '.controls-ListView__itemV',
    ITEM_EDITING: '.js-controls-ListView__item_editing',
    HAS_MORE: '.js-controls-BaseControl__NavigationButton',
    TAG: '.js-controls-tag',
    PREVIEW_CONTENT: '.controls-TileView__previewTemplate_content',
    GROUP: '.controls-ListView__group',
    EXPANDER: '.js-controls-Tree__row-expander',
};

export function closest(event: React.MouseEvent, selector: string): boolean {
    // FIXME: Тут спокойно может не быть closest.
    // @ts-ignore
    return event.target.closest(selector);
}

export function isCheckboxClick(event: React.MouseEvent): boolean {
    return !!closest(event, SELECTORS.CHECKBOX);
}

export function isHasMoreClick(event: React.MouseEvent): boolean {
    return !!closest(event, SELECTORS.HAS_MORE);
}

export function isGroupItem(event: React.MouseEvent, item: TItem): boolean {
    return item instanceof Array || item instanceof Model
        ? closest(event, SELECTORS.GROUP)
        : !!item['[Controls/_display/GroupItem]'];
}

export function isExpander(event: React.MouseEvent): boolean {
    return !!closest(event, SELECTORS.EXPANDER);
}

export function parseViewItemClick<T extends TItem = CollectionItem>(
    { event, item, cleanScheme }: TParseItemClickParams<T>,
    handlers: TParseItemClickHandlers<T>
): void {
    if (cleanScheme) {
        // Пока стопаем все события, позже включим нужные.
        event.stopPropagation();

        if (event?.nativeEvent?.button === 1) {
            // на MacOS нажатие средней кнопкой мыши порождает событие click, но обычно кликом считается только ЛКМ
            return;
        }
    }

    const clickOnCheckbox = isCheckboxClick(event);
    if (clickOnCheckbox) {
        handlers.onCheckbox?.(event, item);
        if (cleanScheme) {
            return;
        }
    }
    if (cleanScheme) {
        if (isHasMoreClick(event)) {
            handlers.onHasMore?.(event, item);
            return;
        }
    }

    if (!cleanScheme) {
        // Проблема в том, что клик по action происходит раньше, чем itemClick.
        // Если мы нажмем на крестик, то состояние editing сбросится в false до itemClick.
        // Но запись перерисоваться не успеет, поэтому смотрим на класс.
        const targetItemElement = closest(event, SELECTORS.ITEM) as unknown as
            | undefined
            | HTMLDivElement;
        const clickOnEditingItem =
            targetItemElement && targetItemElement.matches(SELECTORS.ITEM_EDITING);
        if (
            item['[Controls/_display/SpaceCollectionItem]'] ||
            (item as unknown as CollectionItem).isEditing() ||
            clickOnCheckbox ||
            clickOnEditingItem
        ) {
            event.stopPropagation();
            return;
        }
    }

    if (isGroupItem(event, item)) {
        handlers.onGroup?.(event, item);
        return;
    }

    if (!cleanScheme) {
        // система событий васаби и реакт конфликтуют при всплытии события
        // временное решение проблемы, когда обработчик клика родителя (васаби) стерляет раньше дочерноего (реакт)
        // искусственно делаем порядок вызова реакт -> васаби
        // TODO: https://online.sbis.ru/opendoc.html?guid=2a4e4cd5-e0dd-4d38-ab42-f4c19f0dede3&client=3
        if (closest(event, SELECTORS.PREVIEW_CONTENT)) {
            event.stopPropagation();
            // @ts-ignore
            event.nativeEvent.stopped = true;
        }
    } else {
        // Обработчик клика по тегу
        const tag = closest(event, SELECTORS.TAG);
        if (tag) {
            handlers.onTag?.(event, item);
            return;
        }
    }

    if (isExpander(event)) {
        handlers.onExpander?.(event, item);
        return;
    }

    handlers.onItem?.(event, item);
}
