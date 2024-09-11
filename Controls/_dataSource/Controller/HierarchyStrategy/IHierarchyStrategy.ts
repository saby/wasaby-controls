/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import type { RecordSet } from 'Types/collection';
import type { TKey } from 'Controls/interface';

export type IHierarchyStrategy = (
    childrenProperty: string | undefined,
    root: TKey | undefined,
    items: RecordSet,
    key: TKey
) => RecordSet;
