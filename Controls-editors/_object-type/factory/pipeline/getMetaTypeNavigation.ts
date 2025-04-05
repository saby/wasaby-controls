import { INavigationItem } from './INavigationItem';
import { ObjectMeta } from 'Meta/types';
import { defaultSort } from '../../utils/defaultSort';

/**
 * Получить список для навигации по типе
 * @param metaType
 * @private
 */
export function getMetaTypeNavigation(metaType: ObjectMeta<object>): INavigationItem[] {
    const navigationItems: INavigationItem[] = [];
    Object.values(metaType.getProperties())
        .sort(defaultSort)
        .forEach((property: ObjectMeta<object>) => {
            const group = property.getGroup();
            if (!!group && !navigationItems.some((x) => x.id === group.uid)) {
                navigationItems.push({
                    id: group.uid,
                    name: group.name,
                    parent: null,
                    hasChild: false,
                });
            }
        });

    return navigationItems;
}
