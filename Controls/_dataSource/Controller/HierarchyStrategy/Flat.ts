/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    default as IAddItemsStrategy,
    IHierarchyStrategyOptions,
} from 'Controls/_dataSource/Controller/HierarchyStrategy/IHierarchyStrategy';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';

export default class AddItemsFlatStrategy implements IAddItemsStrategy {
    constructor(strategyOptions: IHierarchyStrategyOptions) {}

    getChildren(items: RecordSet, key: TKey): RecordSet {
        return items;
    }
}
