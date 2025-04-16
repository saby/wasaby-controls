import type { GridCell, GridRow } from 'Controls/gridDisplay';
import type { TColumnScrollViewMode, IGridSelectors } from 'Controls/gridColumnScroll';

interface IGetStickyPropsParams {
    row: GridRow;
    cell: GridCell;
    className?: string;
}

/*
 * Пропсы, необходимые для добавления CSS селекторов фиксированных и скроллируемых колонок.
 */
export interface IColumnScrollProps {
    hasColumnScroll: boolean;
    columnScrollViewMode: TColumnScrollViewMode;
    columnScrollSelectors: IGridSelectors;
    columnScrollIsFixedCell: boolean;
    columnScrollIsFixedToEnd: boolean;
    hasColumnResizer: boolean;
    isSingleColspanedCell: boolean;
    isActsAsRowTemplate: boolean;
    isScrollable: boolean;
}

export function getColumnScrollProps({
    cell,
    row,
    className,
}: IGetStickyPropsParams): IColumnScrollProps {
    return {
        hasColumnScroll: row.hasColumnScroll(),
        columnScrollViewMode: row.getColumnScrollViewMode(),
        columnScrollSelectors: cell.getColumnScrollSelectors(),
        columnScrollIsFixedCell: cell._$isFixed,
        columnScrollIsFixedToEnd: cell._$isFixedToEnd,
        hasColumnResizer: row.getOwner().hasResizer(),
        isSingleColspanedCell: cell._$isSingleColspanedCell,
        isActsAsRowTemplate: cell._$isActsAsRowTemplate,
        // Курсор зависит от наличия скролла.
        // Но если прикладник при помощи класса js-controls-DragScroll__notDraggable отключил скролл на колонке,
        // То курсоры не меняем.
        isScrollable:
            row.hasColumnScroll() &&
            !cell._$isFixed &&
            (!className || className.indexOf('js-controls-DragScroll__notDraggable') === -1),
    };
}
