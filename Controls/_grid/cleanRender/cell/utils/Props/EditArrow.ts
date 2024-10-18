import type { GridCell, GridRow } from 'Controls/gridDisplay';
import {
    isBreadcrumbCell,
    isGroupCell,
    isTreeGroupNodeCell,
    isTreeNodeFooterOrHeaderCell,
} from 'Controls/_grid/utils/Type';
import { isFirstDataCell } from 'Controls/_grid/cleanRender/cell/utils/Props/Cell';

interface IEditArrowUtilProps {
    cell: GridCell;
    row: GridRow;
}

/*
 * Утилита определяет необходимость показывать шеврон редактирования.
 * @param cell
 * @param row
 */
export function shouldDisplayEditArrow({ cell, row }: IEditArrowUtilProps): boolean {
    // Смотрим исключительно на кастомный рендер контента. Не на column.template.
    // Для режима совместимости доп проверка есть на уровне compatibleLayer/CellComponent
    const hasCustomRender = !!cell.config?.render;

    // * Ячейка не поддерживает EditArrow, если она рендерит:
    // * - Группу
    // * - Шапку узла или подвал узла
    // * - Хлебную крошку (т.к. у хлебной даже нет такого места в шаблоне, чтобы отрендерить стрелку редактирования)
    const cellDoesNotSupportEditArrow =
        isGroupCell(cell) ||
        isTreeGroupNodeCell(cell) ||
        isTreeNodeFooterOrHeaderCell(cell) ||
        isBreadcrumbCell(cell);

    // Не показываем шеврон, если
    // * У ячейки задан прикладной шаблон (в таком случае прикладник сам ставит стрелку там, где ему нужно) или
    // * Не первая колонка.
    if (hasCustomRender || cellDoesNotSupportEditArrow || !isFirstDataCell(cell)) {
        return false;
    }
    return row.editArrowIsVisible(row.getContents());
}
