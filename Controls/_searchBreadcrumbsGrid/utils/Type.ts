import type { GridCell } from 'Controls/gridDisplay';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import SearchSeparatorCell from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorCell';

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display строки
 */

/*
 * Утилита проверяет, является ли строка хлебной крошкой
 */
export function isBreadcrumbRow(cell: GridCell): boolean {
    return !!(cell as unknown as BreadcrumbsItemRow)?.[
        '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]'
    ];
}

/*
 * Утилита проверяет, является ли строка разделителем записей из корня
 */
export function isSeparatorRow(cell: GridCell): boolean {
    return !!(cell as unknown as SearchSeparatorRow)?.['[Controls/_display/SearchSeparator]'];
}

/*
 * ###########################################################
 * Тут описываем все утилиты для проверки типов display ячейки
 */

/*
 * Утилита проверяет, принадлежит ли ячейка хлебной крошке
 */
export function isBreadcrumbCell(cell: GridCell): boolean {
    return !!(cell as unknown as BreadcrumbsItemCell)?.$SBGBC;
}

/*
 * Утилита проверяет, принадлежит ли ячейка разделителю записей из корня
 */
export function isSeparatorCell(cell: GridCell): boolean {
    return !!(cell as unknown as SearchSeparatorCell)?.[
        '[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]'
    ];
}
