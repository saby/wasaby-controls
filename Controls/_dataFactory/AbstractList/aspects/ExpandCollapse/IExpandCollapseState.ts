import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';

export interface IExpandCollapseState {
    expandedItems?: CrudEntityKey[];
    collapsedItems?: CrudEntityKey[];
    parentProperty?: string;
    nodeProperty?: string;
    items?: RecordSet;
    keyProperty?: string;
    declaredChildrenProperty?: string;
    singleExpand?: boolean;
}
