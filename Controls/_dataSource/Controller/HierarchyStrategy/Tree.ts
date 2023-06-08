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
    private readonly _childrenProperty: string;
    private readonly _root: TKey;

    constructor({ root, childrenProperty }: IHierarchyStrategyOptions) {
        this._childrenProperty = childrenProperty;
        this._root = root;
    }

    getChildren(items: RecordSet, key: TKey): RecordSet {
        let children;

        if (this._root === key) {
            children = items;
        } else if (items.getRecordById(key)) {
            children = items.getRecordById(key).get(this._childrenProperty);
        } else {
            items.forEach((item) => {
                if (!children) {
                    children = this.getChildren(item.get(this._childrenProperty), key);
                }
            });
        }

        return children;
    }
}
