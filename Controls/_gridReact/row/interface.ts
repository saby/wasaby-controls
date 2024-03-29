import * as React from 'react';
import type { TCellsIterator } from 'Controls/grid';
import { IItemEventHandlers, IItemActionsHandler } from 'Controls/baseList';
import { TRowSeparatorVisibility, TShadowVisibility } from 'Controls/display';
import {
    IFontProps,
    IBackgroundProps,
    TSize,
    IBorderProps,
    ICheckboxProps,
    ICursorProps,
    IMarkerProps,
    IRoundAnglesProps,
    IShadowProps,
    IActionsProps,
    IGridPaddingProps,
    TGridVPaddingSize,
} from 'Controls/interface';

import { TItem } from 'Controls/_gridReact/CommonInterface';

export type TGetRowPropsCallback<TRowProps extends IRowProps = IRowProps> = (
    item: TItem
) => TRowProps;

/**
 * Опции для задания строкам верхнего и нижнего отступа.
 * Применяются отступы внутри ячейки.
 * Задаются на строке, чтобы во всех ячейках эти отсупы были одинаковые.
 * @public
 */
interface IVerticalRowPadding {
    /**
     * @cfg {TGridVPaddingSize} Отступ сверху.
     */
    top?: TGridVPaddingSize;

    /**
     * @cfg {TGridVPaddingSize} Отступ снизу.
     */
    bottom?: TGridVPaddingSize;
}

/**
 * Опции для настройки строки
 * @public
 */
export interface IRowProps
    extends IShadowProps,
        IBorderProps,
        IMarkerProps,
        ICursorProps,
        IRoundAnglesProps,
        IFontProps,
        IBackgroundProps {
    padding?: IVerticalRowPadding;

    /**
     * Высота линии-разделителя строк
     */
    separatorSize?: TSize;

    /**
     * Настройка видимости линий-разделителей строк по краям и внутри списка
     */
    separatorVisibility?: TRowSeparatorVisibility;

    /**
     * Класс стилей, который навешивается на операции записи
     */
    actionsClassName?: string;
}

/**
 * Интерфейс опций компонента строки
 * @private
 */
export interface IRowComponentProps
    extends ICheckboxProps,
        IGridPaddingProps,
        ICursorProps,
        IBackgroundProps,
        IMarkerProps,
        IActionsProps,
        IBorderProps,
        IFontProps {
    /**
     * Запись, которая содержит исходные данные.
     */
    item: TItem;

    /**
     * Опция, для вызова перерисовки при изменении данных.
     * renderValue тут не нужен, т.к. в теории строка зависит от всего item-а.
     * Копировать весь(или практически весь в редких случаях) рекорд - не выгодно.
     */
    itemVersion: number;

    /**
     * Итератор ячеек, пробегается по всем ячейкам этой строки.
     */
    cellsIterator: TCellsIterator;

    handlers: IItemEventHandlers;
    actionHandlers: IItemActionsHandler;
    deactivatedRef?: React.ForwardedRef<HTMLDivElement>;

    // Должен быть интерфейс IShadowProps, но у нас есть свое значение dragging
    shadowVisibility: TShadowVisibility;

    dataQa?: string;
}
