import {
    TParseItemClickParams,
    TParseItemClickHandlers,
    TItem,
} from './parseItemClick';
import parseGridViewItemClick from './parseGridViewItemClick';
import type { CollectionItem } from 'Controls/display';

export default function parseTreeGridViewItemClick<T extends TItem = CollectionItem>(
    params: TParseItemClickParams<T>,
    handlers: TParseItemClickHandlers<T>
): void {
    parseGridViewItemClick(params, handlers);
}
