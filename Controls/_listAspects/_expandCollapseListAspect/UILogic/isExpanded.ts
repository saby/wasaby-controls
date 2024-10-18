import { IExpandCollapseState } from '../IExpandCollapseState';
import { isExpandAll } from './isExpandAll';
import { TKey } from 'Controls/interface';

export function isExpanded(state: IExpandCollapseState, key: TKey): boolean {
    const { expandedItems, collapsedItems } = state;
    return expandedItems.includes(key) || (isExpandAll(state) && !collapsedItems.includes(key));
}
