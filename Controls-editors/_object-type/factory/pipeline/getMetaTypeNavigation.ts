import { INavigationItem } from './INavigationItem';
import { ObjectMeta } from 'Meta/types';
import { defaultSort } from '../../utils/defaultSort';
import { ICategories } from './ICategories';

/**
 * Получить список для навигации по типе
 * @param metaType
 * @param categories общий список категорий
 * @private
 */
export function getMetaTypeNavigation(
    metaType: ObjectMeta<object>,
    categories: ICategories | undefined
): INavigationItem[] {
    const navigationItems: INavigationItem[] = [];
    Object.values(metaType.getProperties())
        .sort(defaultSort)
        .forEach((property: ObjectMeta<object>) => {
            if (property.isHidden()) {
                return;
            }
            if (!!categories) {
                const categoryName = property.getCategory() ?? '';
                if (!navigationItems.some((x) => x.id === categoryName)) {
                    navigationItems.push({
                        id: categoryName,
                        name: categoryName,
                        parent: categories[categoryName]?.parent ?? null,
                        hasChild: false,
                    });
                }

                return;
            }

            const group = property.getGroup();
            if (!navigationItems.some((x) => x.id === group?.uid)) {
                navigationItems.push({
                    id: group?.uid,
                    name: group?.name,
                    parent: null,
                    hasChild: false,
                });
            }
        });

    if (!categories) {
        return navigationItems;
    }

    Object.keys(categories).forEach((categoryName) => {
        const item = navigationItems.find((x) => x.id === categoryName);
        if (!item) {
            navigationItems.push({
                id: categoryName,
                name: categoryName,
                parent: categories[categoryName]?.parent ?? null,
                hasChild: Object.values(categories).some((x) => x.parent === categoryName)
                    ? true
                    : null,
            });
        } else {
            item.hasChild = Object.values(categories).some((x) => x.parent === categoryName)
                ? true
                : null;
        }
    });

    return navigationItems;
}
