import { IGridProps as IBaseGridProps } from 'Controls/gridReact';
import { TColumnScrollStartPosition } from 'Controls/columnScrollReact';
import { TColumnScrollViewMode, TColumnScrollNavigationPosition } from './render/view/interface';

export interface IGridColumnScrollControlSelfProps {
    columnScroll?: boolean;
    stickyColumnsCount?: number;
    endStickyColumnsCount?: number;
    resizerVisibility?: boolean;
    dragScrolling?: boolean;
    columnScrollStartPosition?: TColumnScrollStartPosition;
    columnScrollViewMode?: TColumnScrollViewMode;
    columnScrollNavigationPosition?: TColumnScrollNavigationPosition;
}

/**
 * Опции таблицы с новым быстрым рендером на реакте и скролом колонок.
 * @public
 */
export interface IGridColumnScrollProps extends IBaseGridProps, IGridColumnScrollControlSelfProps {}

export type { TColumnScrollViewMode, TColumnScrollNavigationPosition };
