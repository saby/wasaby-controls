/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';

export interface IHierarchyStrategyOptions {
    root?: TKey;
    childrenProperty?: string;
}

export default interface IHierarchyStrategy {
    getChildren(items: RecordSet, key: TKey): RecordSet;
}
