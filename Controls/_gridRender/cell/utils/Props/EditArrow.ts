import type { GridCell, GridRow } from 'Controls/gridDisplay';
import { isGroupCell, isTreeNodeFooterOrHeaderCell } from 'Controls/_gridRender/utils/Type';
import { isFirstDataCell } from 'Controls/_gridRender/cell/utils/Props/Cell';

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
    // Для режима совместимости доп проверка есть на уровне cL/CellComponent
    const hasCustomRender = !!cell.config?.render;

    // * Ячейка не поддерживает EditArrow, если она рендерит:
    // * - Группу
    // * - Шапку узла или подвал узла
    // * - Хлебную крошку (т.к. у хлебной даже нет такого места в шаблоне, чтобы отрендерить стрелку редактирования)
    const cellDoesNotSupportEditArrow =
        isGroupCell(cell) || cell.$TGGC || isTreeNodeFooterOrHeaderCell(cell) || cell.$SBGBC; // Это дешевле, чем хранить вск утилиты в grid

    // Не показываем шеврон, если
    // * У ячейки задан прикладной шаблон (в таком случае прикладник сам ставит стрелку там, где ему нужно) или
    // * Не первая колонка.
    if (hasCustomRender || cellDoesNotSupportEditArrow || !isFirstDataCell(cell)) {
        return false;
    }
    return row.editArrowIsVisible(row.getContents());
}
