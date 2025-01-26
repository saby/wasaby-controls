import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IMenuPopupOptions } from 'Controls/_menu/interface/IMenuPopup';
import { factory } from 'Types/chain';

export function getIconInRoot(
    items: RecordSet,
    { root, parentProperty }: Pick<IMenuPopupOptions, 'root' | 'parentProperty'>
): Model {
    return factory(items)
        .filter((item) => {
            const itemParent = parentProperty ? item.get(parentProperty) : undefined;
            return item.get('icon') && (itemParent === undefined || itemParent === root);
        })
        .first();
}
