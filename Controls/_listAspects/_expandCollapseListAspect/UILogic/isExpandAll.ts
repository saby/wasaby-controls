import { IExpandCollapseState } from '../IExpandCollapseState';

export const ALL_EXPANDED_VALUE = null;

export function isExpandAll({ expandedItems }: IExpandCollapseState): boolean {
    return expandedItems[0] === ALL_EXPANDED_VALUE;
}
