import type { GridCell, GridRow } from 'Controls/baseGrid';
import {
    isGroupCell,
    isTreeGroupNodeCell,
    isTreeNodeFooterOrHeaderCell,
} from 'Controls/_grid/compatibleLayer/utils/Type';
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

    // Не показываем шеврон, если
    // * Ячейкиа не поддерживает EditArrow или
    // * У ячейки задан прикладной шаблон (в таком случае прикладник сам ставит стрелку там, где ему нужно)
    // * Не первая колонка.
    if (
        hasCustomRender ||
        isGroupCell(cell) ||
        isTreeGroupNodeCell(cell) ||
        isTreeNodeFooterOrHeaderCell(cell) ||
        !isFirstDataCell(cell)
    ) {
        return false;
    }
    return row.editArrowIsVisible(row.getContents());
}
