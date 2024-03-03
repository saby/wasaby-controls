import type { RecordSet } from 'Types/collection';
import type { Path } from './calculatePath';
import calculatePath from './calculatePath';

/**
 * Утилита для получения конфигурации крошек и кнопки назад по RecordSet'e
 * @class Controls/_dataSource/calculateBreadcrumbsData
 * @public
 */
export function calculateBreadcrumbsData(
    oldItems: RecordSet,
    displayProperty: string | undefined
): {
    breadCrumbsItems: Path;
    backButtonCaption: string;
    breadCrumbsItemsWithoutBackButton: Path;
} {
    const {
        backButtonCaption,
        path: breadCrumbsItems,
        pathWithoutItemForBackButton: breadCrumbsItemsWithoutBackButton,
    } = calculatePath(oldItems, displayProperty);

    return {
        breadCrumbsItems,
        backButtonCaption,
        breadCrumbsItemsWithoutBackButton,
    };
}
