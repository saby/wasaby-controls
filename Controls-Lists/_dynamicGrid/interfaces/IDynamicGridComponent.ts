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

import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { View as SearchBreadcrumbsGridView } from 'Controls/searchBreadcrumbsGrid';
import {
    IBaseTimelineGridComponentProps,
    ITimelineComponentEventsProps,
} from './IEventRenderProps';
import {
    ICellsMultiSelectAccessibility,
    TOnSelectionChangedCallback,
    TOnBeforeSelectionChangeCallback,
} from 'Controls-Lists/_dynamicGrid/selection/shared/interface';

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
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback
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
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TBaseMouseEventCallback
 */
export type TBaseMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>
) => void;

/**
 * Коллбек, возвращающий {@link Controls/gridReact:ICellProps параметры для динамически создаваемой ячейки}.
 * Функция принимает запись RecordSet и данные, по которым строится динамическая ячейка.
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TGetDynamicCellPropsCallback
 */
export type TGetDynamicCellPropsCallback<T = TBaseColumnKey> = (
    item: Model,
    cellData: T
) => ICellProps;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/**
 * Интерфейс конфигурации динамически создаваемой ячейки.
 * @interface Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicColumnConfig
 * @extends Controls/gridReact:IColumnConfig
 * @public
 */
export interface IDynamicColumnConfig<T = TBaseColumnKey> extends IColumnConfig {
    /**
     * Функция, возвращающая свойства ячейки
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicColumnConfig#getCellProps
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TGetDynamicCellPropsCallback.typedef}
     */
    getCellProps?: TGetDynamicCellPropsCallback<T>;
}

/**
 * Тип для обработчика клика по элементу записи списка
 * Аргументы:
 * * item
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TItemCustomClick
 */
export type TItemCustomClick = (item: Model) => void;

/**
 * Интерфейс конфигурации подключенного компонента "Таблица с генерируемыми колонками"
 * @interface Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @extends Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/ITimelineComponentOptions
 * @extends Controls/treeGrid:ITreeGridOptions
 *
 * @ignoreOptions columns
 *
 * @public
 */
export interface IBaseDynamicGridComponentProps
    extends IBaseTimelineGridComponentProps,
        Omit<ITreeGridOptions, 'columns'> {
    gridComponentRef?: React.ForwardedRef<View>;
    refOnlyForWasaby?: React.ForwardedRef<HTMLDivElement>;
    /**
     * Функция обратного вызова при клике на fячейку динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback.typedef}
     */
    onDynamicColumnClick?: TDynamicColumnMouseEventCallback;
    /**
     * Функция обратного вызова при нажатии кнопки мыши на ячейку динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TDynamicColumnMouseEventCallback.typedef}
     */
    onDynamicColumnMouseDown?: TDynamicColumnMouseEventCallback;
    /**
     * Функция обратного вызова при нажатии кнопки мыши на шеврон редактирования
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/TItemClick.typedef}
     */
    onEditArrowClick?: TItemCustomClick;
    /**
     * Ширина рабочей области. Необходима для корректного рендеринга динамической сетки. Значение используется при определении диапазона отображаемых колонок.
     * Значение этого поля можно получить из {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/workspace-config/ конфигурации страницы}
     * @cfg
     * @see /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/workspace-config/ конфигурация страницы
     */
    viewportWidth: number;
    /**
     * Итоги таблицы
     * @cfg
     */
    results?: IResultConfig[];
    /**
     * Функция, возвращающая параметры для рендеринга строки таблицы.
     * @cfg {Controls/_gridReact/row/interface/TGetRowPropsCallback.typedef}
     */
    getRowProps?: TGetRowPropsCallback;
    /**
     * Размер отступов между колонками
     * @cfg {Controls/interface/TOffsetSize.typedef}
     */
    columnsSpacing?: TOffsetSize;
    /**
     * Режим отображения ховера в таблице с динамическими колонками
     * @default cross
     * @cfg
     */
    hoverMode?: THoverMode;
}

/**
 * Интерфейс конфигурации компонента "Таблица с генерируемыми колонками"
 * @interface Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps
 * @extends Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @extends Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/ITimelineComponentOptions
 * @extends Controls-Lists/_dynamicGrid/selection/shared/interface/ICellsMultiSelectAccessibility
 * @public
 */
export interface IDynamicGridComponentProps
    extends IBaseDynamicGridComponentProps,
        ITimelineComponentEventsProps,
        ICellsMultiSelectAccessibility {
    /**
     * Параметры статичных колонок.
     * Статичные колонки отображают информацию, которая при горизонтальной прокрутке всегда остаётся на виду.
     * Например, в “графиках работ” это данные по сотрудникам (фио, должность и т. п.).
     * @cfg {Array.<Controls/gridReact:IColumnConfig>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#staticColumns
     */
    staticColumns: IColumnConfig[];
    /**
     * Параметры дополнительных статичных колонок.
     * Доплоительные колонки используются для отображения итогов по строкам.
     * @cfg {Array.<Controls/gridReact:IColumnConfig>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#endStaticColumns
     */
    endStaticColumns?: IColumnConfig[];
    /**
     * Параметры динамических колонок
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicColumnConfig}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#dynamicColumn
     */
    dynamicColumn: IDynamicColumnConfig;
    /**
     * Параметры заголовков статичных колонок
     * @cfg {Array.<Controls/gridReact:IHeaderConfig>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#staticHeaders
     */
    staticHeaders: IHeaderConfig[];
    /**
     * Параметры заголовков дополнительных статичных колонок.
     * @cfg {Array.<Controls/gridReact:IHeaderConfig>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#endStaticHeaders
     */
    endStaticHeaders?: IHeaderConfig[];
    /**
     * Параметры заголовков динамических колонок.
     * @cfg {Controls/gridReact:IHeaderConfig}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#dynamicHeader
     */
    dynamicHeader: IHeaderConfig;
    dynamicColumnsCount: number;
    /**
     * Параметры статичных колонок подвала
     * @cfg {Array.<Controls/gridReact:IFooterConfig>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#staticFooter
     */
    staticFooter?: IFooterConfig[];
    /**
     * Параметры подвала динамических колонок.
     * @cfg {Controls/gridReact:IHeaderConfig}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#dynamicFooter
     */
    dynamicFooter?: IFooterConfig;
    /**
     * Данные для построения динамической сетки.
     * @cfg {Array<Controls/gridReact:TColumnKey>}
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#dynamicColumnsGridData
     */
    dynamicColumnsGridData: TColumnKeys;
    /**
     * Версия динамических данных в колонках
     */
    columnsDataVersion: number;
    /**
     * Функция, вызываемая когда скролл дошёл до последней колонки
     */
    columnsEndedCallback: IColumnsEndedCallback;
    /**
     * Квант для биения на колонки
     * @TODO должно уйти в таймлайн
     */
    quantum?: TQuantumType;
    /**
     * Режим отображения списочного контрола.
     * Прменяется для отображения поиска
     */
    viewMode: TViewMode;
    /**
     * Отображаемый диапазон записей
     */
    visibleRange: IItemsRange;
    /**
     * Плотность отображения данных.
     * От нее зависит, выравнивание контента в ячейке и наличие дней недели в заголовке
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#columnDataDensity
     * @cfg {Controls-Lists/dynamicGrid/TColumnDataDensity.typedef}
     */
    columnDataDensity: TColumnDataDensity;
    /**
     * Функция.вызываемая при клике на заголовок
     * @param event
     */
    onHeaderClick?: (event: React.MouseEvent) => void;
    /**
     * Функция обратного вызова при изменении мультивыбора ячеек.
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#onSelectedCellsChanged
     * @cfg
     */
    onSelectedCellsChanged?: TOnSelectionChangedCallback;
    /**
     * Функция обратного вызова до изменения мультивыбора ячеек.
     * @field Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps#onBeforeSelectedCellsChanged
     * @cfg
     */
    onBeforeSelectedCellsChanged?: TOnBeforeSelectionChangeCallback;
    // Функция, возвращающая параметры основной колонки, в которой генерируется сетка
    getDynamicColumnProps?: Function;
    // Функция, возвращающая параметры заголовка основной колонки, в которой генерируется сетка
    getDynamicColumnHeaderProps?: () => ICellProps;
    /**
     * Контент отображаемый внутри списочного контрола, непосредственно над записями или пустым представлением.
     */
    beforeItemsContent?: React.ReactElement;
    /**
     * Контент отображаемый внутри списочного контрола, непосредственно под записями или пустым представлением.
     */
    afterItemsContent?: React.ReactElement;
    /**
     * Позиция горизонтального скролбара при инициализации компонента.
     */
    initialColumnScrollPosition?: number;
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
