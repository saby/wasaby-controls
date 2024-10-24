import type {
    GridCell,
    GridGroupCell,
    SpaceCell,
    GridRow,
    GridGroupRow,
    SpaceRow,
} from 'Controls/gridDisplay';
import type {
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataCell,
    TreeGridNodeFooterRow,
} from 'Controls/treeGridDisplay';
import type { BreadcrumbsItemCell, SearchSeparatorCell } from 'Controls/searchBreadcrumbsGrid';

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display строки
 */

/*
 * Утилита проверяет, является ли строка группой
 */
export function isGroupRow(row: GridRow): boolean {
    return !!(row as unknown as GridGroupRow)?.['[Controls/_display/grid/GroupRow]'];
}

/*
 * Утилита проверяет, является ли строка разделителем
 */
export function isSpaceRow(row: GridRow): boolean {
    return !!(row as unknown as SpaceRow)?.['[Controls/_display/SpaceCollectionItem]'];
}

/*
 * Утилита проверяет, является ли строка разделителем
 */
export function isNodeFooterRow(row: GridRow): boolean {
    return !!(row as unknown as TreeGridNodeFooterRow)?.['[Controls/tree:TreeNodeFooterItem]'];
}

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display ячейки
 */

/*
 * Утилита проверяет, принадлежит ли ячейка группе
 */
export function isGroupCell(cell: GridCell): boolean {
    return !!(cell as GridGroupCell)?.['[Controls/_display/grid/GroupCell]'];
}

/*
 * Утилита проверяет, является ли строка разделителем
 */
export function isSpaceCell(row: GridCell): boolean {
    return !!(row as unknown as SpaceCell)?.['[Controls/_display/grid/SpaceCell]'];
}

/*
 * Утилита проверяет, принадлежит ли ячейка шапке или подвалу узла
 */
export function isTreeNodeFooterOrHeaderCell(cell: GridCell): boolean {
    return !!(cell as unknown as TreeGridNodeExtraItemCell)?.[
        '[Controls/treeGrid:TreeGridNodeExtraItemCell]'
    ];
}

/*
 * Утилита проверяет, принадлежит ли ячейка узлу дерева в виде группы
 */
export function isTreeGroupNodeCell(cell: GridCell): boolean {
    return !!(cell as unknown as TreeGridGroupDataCell)?.[
        '[Controls/treeGrid:TreeGridGroupDataCell]'
    ];
}

/*
 * Утилита проверяет, принадлежит ли ячейка хлебной крошке
 */
export function isBreadcrumbCell(cell: GridCell): boolean {
    return !!(cell as unknown as BreadcrumbsItemCell)?.[
        '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]'
    ];
}

/*
 * Утилита проверяет, принадлежит ли ячейка разделителю записей из корня
 */
export function isSeparatorCell(cell: GridCell): boolean {
    return !!(cell as unknown as SearchSeparatorCell)?.[
        '[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]'
    ];
}
