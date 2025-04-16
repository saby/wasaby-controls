import type * as React from 'react';
import type { CollectionItem } from 'Controls/display';
import { controller as localeController } from 'I18n/singletonI18n';
import { TItem } from 'Controls/_listsCommonLogic/helpers/events/parseItemClick';

export type TParseItemSwipeParams<T extends TItem> = {
    event: React.TouchEvent;
    item: T;
};

export type TEventNames = 'onSwipeRight' | 'onSwipeLeft';

export type THandler<T extends TItem, TExtraArgs extends unknown[] = []> = (
    ...args: [React.TouchEvent, T, ...TExtraArgs]
) => void;

export type TParseItemSwipeHandlers<T extends TItem> = Partial<Record<TEventNames, THandler<T>>>;

const [L, R] = ['left', 'right'];

export default function parseItemSwipe<T extends TItem = CollectionItem>(
    params: TParseItemSwipeParams<T>,
    handlers: TParseItemSwipeHandlers<T>
): void {
    let direction: string = (params.event.nativeEvent as unknown as { direction: string })
        .direction;
    if (localeController.currentLocaleConfig.directionality === 'rtl') {
        direction =
            {
                [L]: R,
                [R]: L,
            }[direction] || direction;
    }
    if (direction === L) {
        handlers.onSwipeLeft?.(params.event, params.item);
    }
    if (direction === R) {
        handlers.onSwipeRight?.(params.event, params.item);
    }
}
