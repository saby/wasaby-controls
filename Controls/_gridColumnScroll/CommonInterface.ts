import { IGridProps as IBaseGridProps } from 'Controls/gridReact';
import { IGridViewColumnScrollClearProps } from './render/view/interface';

/**
 * Опции таблицы с новым быстрым рендером на реакте и скролом колонок.
 * @public
 */
export interface IGridProps
    extends IBaseGridProps,
        IGridViewColumnScrollClearProps {
    dragScrolling?: boolean;
}
