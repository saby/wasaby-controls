import { GridCell, GridRow } from 'Controls/baseGrid';
import type { TColumnScrollViewMode, IGridSelectors } from 'Controls/gridColumnScroll';

interface IGetStickyPropsParams {
    row: GridRow;
    cell: GridCell;
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
}

export function getColumnScrollProps({ cell, row }: IGetStickyPropsParams): IColumnScrollProps {
    return {
        hasColumnScroll: row.hasColumnScroll() || row.hasColumnScrollReact(),
        columnScrollViewMode: row.getColumnScrollViewMode(),
        columnScrollSelectors: cell.getColumnScrollSelectors(),
        columnScrollIsFixedCell: cell._$isFixed,
        columnScrollIsFixedToEnd: cell._$isFixedToEnd,
        hasColumnResizer: row.getOwner().hasResizer(),
        isSingleColspanedCell: cell._$isSingleColspanedCell,
        isActsAsRowTemplate: cell._$isActsAsRowTemplate,
    };
}
