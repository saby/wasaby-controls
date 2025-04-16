import * as React from 'react';
import { closest, TItem, TParseItemClickHandlers, TParseItemClickParams } from './parseItemClick';
import parseGridViewItemClick from './parseGridViewItemClick';
import type { CollectionItem } from 'Controls/display';

const NODE_HEADER_LOAD_MORE_SELECTOR = '.controls-Tree__nodeHeaderLoadMore';
const NODE_FOOTER_LOAD_MORE_SELECTOR = '.controls-Tree__nodeFooterLoadMore';

export function isNodeHeaderLoadMore(event: React.MouseEvent): boolean {
    return !!closest(event, NODE_HEADER_LOAD_MORE_SELECTOR);
}
export function isNodeFooterLoadMore(event: React.MouseEvent): boolean {
    return !!closest(event, NODE_FOOTER_LOAD_MORE_SELECTOR);
}

export default function parseTreeGridViewItemClick<T extends TItem = CollectionItem>(
    params: TParseItemClickParams<T>,
    handlers: TParseItemClickHandlers<T>
): boolean {
    if (params.cleanScheme) {
        params.event.stopPropagation();

        if (isNodeFooterLoadMore(params.event)) {
            handlers.nodeHasMore?.(params.event, params.item, 'down');
            return true;
        }
        if (isNodeHeaderLoadMore(params.event)) {
            handlers.nodeHasMore?.(params.event, params.item, 'up');
            return true;
        }
    }
    return parseGridViewItemClick(params, handlers);
}
