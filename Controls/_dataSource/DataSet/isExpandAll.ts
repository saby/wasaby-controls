import { TKey } from 'Controls/interface';

export default function isExpandAll(expandedItems?: TKey[]): boolean {
    return Array.isArray(expandedItems) && expandedItems[0] === null;
}
