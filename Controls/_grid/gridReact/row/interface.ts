import * as React from 'react';
import type { TCellsIterator, GridCell, TColumns } from 'Controls/grid';
import { IItemEventHandlers, IItemActionsHandler } from 'Controls/baseList';
import { TGroupViewMode, TRowSeparatorVisibility, TShadowVisibility } from 'Controls/display';
import { TemplateFunction } from 'UICommon/Base';
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
    IStickyProps,
    TBackgroundStyle,
} from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';

import { TItem } from 'Controls/_grid/gridReact/CommonInterface';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import type { GridHeaderCell, GridFooterCell, GridResultsCell } from 'Controls/baseGrid';

export interface IBeforeContentRenderProps {
    cell: GridCell;
}

/**
 * Интерфейс функции, возвращающей конфигурацию строки таблицы,
 *
 * Принимает аргумент item: {@link Types/entity:Model} и возвращает {@link Controls/grid:IRowProps}
 * @typedef {Function} Controls/_grid/gridReact/row/interface/TGetRowPropsCallback
 */
export type TGetRowPropsCallback<TRowProps extends IRowProps = IRowProps> = (
    item: TItem
) => TRowProps;

/**
 * Опции для задания строкам верхнего и нижнего отступа.
 * Применяются отступы внутри ячейки.
 * Задаются на строке, чтобы во всех ячейках эти отсупы были одинаковые.
 * @public
 */
export interface IVerticalRowPadding {
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
 * Параметры множественного выбора
 * @interface Controls/_grid/gridReact/row/interface/IMultiSelectProps
 * @public
 */
export interface IMultiSelectProps {
    /**
     * Компонент, используемый для отрисовки чекбоксов множественного выбора.
     * Платформа предоставляет следующие компоненты:
     * * Controls/list:CheckboxCircleMarker
     * * Controls/checkbox:CheckboxMarker
     * @default Controls/checkbox:CheckboxMarker
     */
    multiSelectRender?: React.ReactElement;
}

/**
 * Параметры атрибутов строки
 * @interface Controls/_grid/gridReact/row/interface/IAttrsProps
 * @public
 */
export interface IAttrsProps {
    /**
     * Параметр data-qa атрибута
     */
    dataQa?: string;

    /**
     * Параметр data-name атрибута
     */
    dataName?: string;
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
        IBackgroundProps,
        IAttrsProps,
        IMultiSelectProps {
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
     * Дополнительный CSS класс, который добавляется к стандартным действиям над записью.
     */
    actionsClassName?: string;

    /**
     * Опция для оптимизации группы прилипающих элементов,
     * позволяет задать позицию для прилипания сразу, а не после расчета.
     */
    fixedPositionInitial?: string;

    /**
     * Класс стилей, который навешивается на операции записи
     */
    className?: string;
}

// Опции для совместимости с wasaby-списками
interface ICompatibleRowComponentProps {
    compatibleMultiSelectTemplate?: TemplateFunction;
}

/**
 * Интерфейс опций компонента строки
 * @private
 */
export interface IRowComponentProps
    extends Pick<ICheckboxProps, 'checkboxVisibility'>,
        IGridPaddingProps,
        ICursorProps,
        IBackgroundProps,
        IMarkerProps,
        IActionsProps,
        Pick<IBorderProps, 'borderVisibility'>,
        IFontProps,
        IStickyProps,
        IMultiSelectProps,
        ICompatibleRowComponentProps {
    attrs?: {
        // compatibility.
        title?: string;
        'data-qa'?: string;
        'data-target'?: string;
        'type-data-qa'?: string;
        'item-parent-key'?: string;
    };
    'item-key': CrudEntityKey;

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

    gridColumnsConfig?: TColumns;

    /**
     * Итератор ячеек, пробегается по всем ячейкам этой строки.
     */
    cellsIterator: TCellsIterator;

    handlers: IItemEventHandlers;
    actionHandlers: IItemActionsHandler;
    deactivatedRef?: React.ForwardedRef<HTMLDivElement>;

    // Должен быть интерфейс IShadowProps, но у нас есть свое значение dragging
    shadowVisibility: TShadowVisibility;

    cCountStart?: number;
    cCountEnd?: number;
    'data-qa'?: string;
    'data-name'?: string;
    tabIndex?: number;
    innerFocusElement?: boolean;

    // Режим ховера - по ячейкам или по всей строке.
    hoverMode?: 'cell' | 'row';

    className?: string;
    groupProperty?: string;
    pixelRatioBugFix?: boolean;
    subPixelArtifactFix?: boolean;
    groupViewMode?: TGroupViewMode;
    // Ответственность backgroundColorStyle - покрасить любые ячйки, Fixed, Sticky, элементы, у которых есть z-index и обычные ячейки.
    // Ответственность backgroundStyle на списке - Fixed, Sticky ячйки и другие элементы, у которых есть z-index
    // Правильно будет backgroundColorStyle использовать вместо backgroundStyle,
    // И добавить публичную опцию fixedBackgroundColorStyle, которая позволит настраивать фон только для Sticky, Fixed и других элементов, у которых есть z-index.
    // Потому что не всегда надо заливать все ячейки цветом. Могут быть прозрачные ячейки, при том что залипшие принимают какой-то фон.
    backgroundColorStyle?: TBackgroundStyle;
    fadedClass: string;
    // Стиль master или default
    decorationStyle?: 'master' | 'default';

    beforeContentRender?: React.FunctionComponent<IBeforeContentRenderProps>;

    // Тут совместимость для отображения опций записи в произвольном месте шаблона,
    // эту опцию можно было бы заменить на что-то получше.
    showItemActionsOnHover?: boolean;

    // Запись становится активной, когда с ней производится какое-либо действие (меню, свайп etc)
    // При этом запись должна отмечаться цветом по ховеру (стандарт).
    isActive?: boolean;

    // Внутренний параметр. Используется для установки компонента, с помощью которого выводятся ячейки строки.
    _$FunctionalCellComponent?: React.FunctionComponent<ICellComponentProps>;

    // Внутренний параметр. Используется для рендера "чистых" реакт компонентов.
    _$getCleanCellComponent?: (
        cell: GridCell | GridHeaderCell | GridFooterCell | GridResultsCell,
        rowProps?: IRowComponentProps
    ) => React.ReactElement | null;

    // Внутренний параметр. Используется для рендера реакт компонентов, совместимых с wasaby синтаксисом.
    _$getCompatibleCellComponent?: (
        cell: GridCell,
        cellProps: ICellComponentProps,
        baseRowProps: IRowComponentProps,
        multiSelectTemplate: React.ReactElement,
        beforeContentRenderProp?: React.FunctionComponent<IBeforeContentRenderProps>
    ) => React.ReactElement | null;

    // Внутренний параметр. Используется для рендера пользовательского контента реакт компонентов, совместимых с wasaby синтаксисом.
    _$getDirtyCellComponentContentRender?: (
        cell: GridCell,
        cellProps: ICellComponentProps,
        multiSelectTemplate: React.ReactElement
    ) => React.ReactElement | null;
}
