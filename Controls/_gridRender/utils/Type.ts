import type {
    GridCell,
    GridGroupCell,
    SpaceCell,
    GridRow,
    GridGroupRow,
    SpaceRow,
} from 'Controls/gridDisplay';
import type { TreeGridNodeExtraItemCell, TreeGridNodeFooterRow } from 'Controls/treeGridDisplay';

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display строки
 */

/*
 * Утилита проверяет, является ли строка группой
 */
export function isGroupRow(row: GridRow): boolean {
    return !!(row as unknown as GridGroupRow)?.$GGR;
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
    return !!(row as unknown as TreeGridNodeFooterRow)?.$TNF;
}

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display ячейки
 */

/*
 * Утилита проверяет, принадлежит ли ячейка группе
 */
export function isGroupCell(cell: GridCell): boolean {
    return !!(cell as GridGroupCell)?.$GGC;
}

/*
 * Утилита проверяет, является ли строка разделителем
 */
export function isSpaceCell(row: GridCell): boolean {
    return !!(row as unknown as SpaceCell)?.$GSC;
}

/*
 * Утилита проверяет, принадлежит ли ячейка шапке или подвалу узла
 */
export function isTreeNodeFooterOrHeaderCell(cell: GridCell): boolean {
    return !!(cell as unknown as TreeGridNodeExtraItemCell)?.$TGNEC;
}
