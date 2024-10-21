/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import type { RecordSet } from 'Types/collection';
import type { IHierarchyStrategy } from './IHierarchyStrategy';

const getChildren: IHierarchyStrategy = (childrenProperty, root, items, key) => {
    let children: RecordSet = items;
    if (childrenProperty == null) {
        throw new TypeError();
    }

    if (key != null && items.getRecordById(key)) {
        children = items.getRecordById(key).get(childrenProperty);
    } else {
        items.forEach((item) => {
            if (!children) {
                children = getChildren(childrenProperty, root, item.get(childrenProperty), key);
            }
        });
    }

    return children;
};

export default getChildren;
