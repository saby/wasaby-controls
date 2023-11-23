import * as React from 'react';
import { View, ITreeGridOptions, View as TreeGridComponent } from 'Controls/treeGrid';
import {
    IColumnConfig,
    IHeaderConfig,
    IResultConfig,
    TGetRowPropsCallback,
    TColumnKey as TBaseColumnKey,
    IFooterConfig,
    ICellProps,
} from 'Controls/gridReact';
import { TNavigationDirection, TOffsetSize } from 'Controls/interface';
import { TViewMode } from 'Controls-DataEnv/interface';
import { IItemsRange } from 'Controls/baseList';
import { TQuantumType, TColumnDataDensity, TColumnKeys } from '../shared/types';

import { IGridSelectionContainerProps, ISelection } from '../selection/SelectionContainer';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { View as SearchBreadcrumbsGridView } from 'Controls/searchBreadcrumbsGrid';
import {
    IBaseTimelineGridComponentProps,
    ITimelineComponentEventsProps,
} from './IEventRenderProps';

/**
 * Режим ховера для Таблицы с генерируемыми колонками
 * @typedef {String} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/THoverMode
 * @variant cross Ячейка по ховеру находится в центре "креста", образованного рамками столбца и строки
 * @variant cell Ячейка по ховеру обозначена рамкой.
 */
export type THoverMode = 'cross' | 'cell';

export type IColumnsEndedCallback = (direction: TNavigationDirection) => void;

/**
 * Тип функции обратного вызова для обработки событий мыши на ячейках динамической сетки "Таймлайн Таблицы".
 * Принимает следующие аргументы:
 * * contents: {@link Types/entity:Model} Содержимое записи, для которой вызывается обработчик.
 * * originalEvent: {@link UICommon/Events:SyntheticEvent} Оригинальное событие
 * * columnKey: {@link unknown} Данные, по которым сформирована динамическая колонка.
 * @typedef Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback
 */
export type TDynamicColumnMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>,
    columnKey: TBaseColumnKey
) => void;

/**
 * Тип функции обратного вызова для обработки событий мыши на строках и ячейках "Таймлайн Таблицы".
 * Принимает следующие аргументы:
 * * contents: {@link Types/entity:Model} Содержимое записи, для которой вызывается обработчик.
 * * originalEvent: {@link UICommon/Events:SyntheticEvent} Оригинальное событие
 * @typedef Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TBaseMouseEventCallback
 */
export type TBaseMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>
) => void;

/**
 * Коллбек, возвращающий {@link Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/ICellProps параметры для динамически создаваемой ячейки}.
 * Функция принимает запись RecordSet и данные, по которым строится динамическая ячейка.
 * @typedef {String} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TGetDynamicCellPropsCallback
 */
export type TGetDynamicCellPropsCallback<T = TBaseColumnKey> = (
    item: Model,
    cellData: T
) => ICellProps;

/**
 * Интерфейс конфигурации динамически создаваемой ячейки.
 * @interface Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicColumnConfig
 * @public
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface IDynamicColumnConfig<T = TBaseColumnKey> extends IColumnConfig {
    getCellProps: TGetDynamicCellPropsCallback<T>;
}

/**
 * Интерфейс свойств подключенного компонента "Таблица с генерируемыми колонками"
 * @interface Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @public
 */
export interface IBaseDynamicGridComponentProps
    extends IBaseTimelineGridComponentProps,
        Omit<ITreeGridOptions, 'columns'> {
    gridComponentRef?: React.ForwardedRef<View>;
    refOnlyForWasaby?: React.ForwardedRef<HTMLDivElement>;
    /**
     * Функция обратного вызова при клике на ячейку динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback.typedef}
     */
    onDynamicColumnClick?: TDynamicColumnMouseEventCallback;
    /**
     * Функция обратного вызова при нажатии кнопки мыши на ячейку динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback.typedef}
     */
    onDynamicColumnMouseDown?: TDynamicColumnMouseEventCallback;
    /**
     * Ширина рабочей области. Необходима для корректного рендеринга динамической сетки.
     */
    viewportWidth?: number;
    /**
     * Итоги таблицы
     */
    results?: IResultConfig[];
    /**
     * Позиция горизонтального скролбара при инициализации компонента.
     */
    initialColumnScrollPosition?: number;
    /**
     * Функция обратного вызова для получения свойств для рендеринга строки таблицы.
     * @cfg {Controls/_gridReact/row/interface/TGetRowPropsCallback.typedef}
     */
    getRowProps?: TGetRowPropsCallback;
    /**
     * Отступы между колонками
     * @cfg {Controls/interface/TOffsetSize.typedef}
     */
    columnsSpacing?: TOffsetSize;
    /**
     * Режим отображения ховера в таблице с динамическими колонками
     * @default cell
     */
    hoverMode?: THoverMode;
}

export interface IDynamicGridComponentProps
    extends IBaseDynamicGridComponentProps,
        ITimelineComponentEventsProps {
    staticColumns: IColumnConfig[];
    endStaticColumns?: IColumnConfig[];
    dynamicColumn: IDynamicColumnConfig;
    staticHeaders: IHeaderConfig[];
    endStaticHeaders?: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    dynamicColumnsCount: number;
    staticFooter?: IFooterConfig[];
    dynamicFooter?: IFooterConfig;
    dynamicColumnsGridData: TColumnKeys;
    columnsDataVersion: number;
    columnsEndedCallback: IColumnsEndedCallback;
    quantum?: TQuantumType;
    viewMode: TViewMode;
    visibleRange: IItemsRange;
    columnDataDensity: TColumnDataDensity;
    onHeaderClick?: (event: React.MouseEvent) => void;
    cellsMultiSelectVisibility?: IGridSelectionContainerProps['multiSelectVisibility'];
    cellsMultiSelectAccessibilityCallback?: IGridSelectionContainerProps['multiSelectAccessibilityCallback'];
    selectedCells?: ISelection;
    onSelectedCellsChanged?: IGridSelectionContainerProps['onSelectionChanged'];
    onBeforeSelectedCellsChanged?: IGridSelectionContainerProps['onBeforeSelectionChange'];
    // Функция, возвращающая параметры основной колонки, в которой генерируется сетка
    getDynamicColumnProps?: Function;
    // Функция, возвращающая параметры основной колонки заголовка, в которой генерируется сетка
    getDynamicColumnHeaderProps?: () => ICellProps;
    /**
     * Контент отображаемый внутри списочного контрола, непосредственно над записями или пустым представлением.
     */
    beforeItemsContent?: React.ReactElement;
    /**
     * Контент отображаемый внутри списочного контрола, непосредственно под записями или пустым представлением.
     */
    afterItemsContent?: React.ReactElement;
}

export interface IDynamicGridComponentState {
    gridComponent: typeof SearchBreadcrumbsGridView | typeof TreeGridComponent;
    className: string;
    viewMode: TViewMode;
    getRowProps: TGetRowPropsCallback;
    dynamicColumnsGridData: TColumnKeys;
    columnsDataVersion: number;
    preparedColumns: IColumnConfig[];
    preparedHeaders: IHeaderConfig[];
    preparedFooter: IFooterConfig[];
    dynamicColumn: IDynamicColumnConfig;
    visibleRange: IItemsRange;
    initialColumnScrollPosition?: number;
    hoverMode?: THoverMode;
}
