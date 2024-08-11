import { TKey } from 'Controls/interface';

export type TBeforeSearchSnapshot = {
    // FIXME: Может быть undefined или нет?
    root: TKey;
    hasHierarchyFilter: boolean;
    hasRootInFilter: boolean;
};
