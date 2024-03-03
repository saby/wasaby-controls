import type { IColumnConfig, IHeaderConfig, IFooterConfig } from 'Controls/gridReact';
import type { IListDataFactoryArguments } from 'Controls/dataFactory';
import type { TNavigationDirection } from 'Controls/interface';
import { IDynamicColumnConfig } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';
import { ICellsMultiSelectAccessibility } from 'Controls-Lists/_dynamicGrid/selection/shared/interface';

/**
 * Интерфейс параметров курсорной навигации.
 *
 * Значение поля field будет использовано при формирования фильтра для горизонтальной навигации и последующей передаче в RecordSet данных динамических колонок.
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments/IDynamicColumnsNavigationSourceConfig
 * @template TPosition Тип курсора (По умолчанию - число)
 * @public
 */
export interface IDynamicColumnsNavigationSourceConfig<TPosition = number> {
    /**
     * Имя свойства записи, содержащего курсор.
     */
    field: string;
    /**
     * Направление навигации.
     */
    direction?: TNavigationDirection;
    /**
     * Ограничение количества загружаемых колонок.
     */
    limit?: number;
    /**
     * Начальное значение курсора.
     * @cfg {String}
     * @field Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments/IDynamicColumnsNavigationSourceConfig#position
     */
    position?: TPosition;
}

/**
 * Интерфейс параметров горизонтальной навигации
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments/IDynamicColumnsNavigation
 * @public
 */
export interface IDynamicColumnsNavigation<TPosition = number> {
    /**
     * Параметры для курсорной навигации
     */
    sourceConfig: IDynamicColumnsNavigationSourceConfig<TPosition>;
}

export type TColumnsNavigationMode = 'infinity' | 'limited';

export interface IDynamicColumnsFilter<TPosition = number> {
    direction: TNavigationDirection;
    limit: number;
    position: TPosition;
}

/**
 * Интерфейс аргументов фабрики таблицы с загружаемыми колонками
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments
 * @extends Controls/_dataFactory/List/_interface/IListDataFactoryArguments
 * @public
 */
export interface IDynamicGridDataFactoryArguments<
    TNavigationPosition = number,
    TColumnsGridData = number
> extends IListDataFactoryArguments,
        ICellsMultiSelectAccessibility {
    /**
     * Параметры статичных колонок.
     * Статичные колонки отображают информацию, которая при горизонтальной прокрутке всегда остаётся на виду.
     * Например, в “графиках работ” это данные по сотрудникам (фио, должность и т. п.).
     * @cfg {Array.<Controls/gridReact:IColumnConfig>}
     * @example
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *     staticColumns: [
     *         {
     *             key: 'staticColumn',
     *             width: '300px',
     *             render: ...,
     *         },
     *     ],
     * }
     * </pre>
     *
     * В параметре render нужно указать шаблон отрисовки, например:
     *
     * <pre class="brush: js">
     * import * as React from 'react';
     * import { useItemData } from 'Controls/gridReact';
     *
     * export default function DemoStaticColumnComponent(): React.ReactElement {
     *     const { renderValues, item } = useItemData(['fullName', 'job']);
     *     return (
     *         <span className="tw-flex tw-overflow-hidden tw-items-center">
     *             <div className="tw-overflow-hidden">
     *                 <div className="tw-truncate">{renderValues.fullName}</div>
     *                 <div className="tw-truncate">{renderValues.job}</div>
     *             </div>
     *         </span>
     *     );
     * }
     * </pre>
     */
    staticColumns: IColumnConfig[];
    /**
     * Параметры заголовков статичных колонок
     * @cfg {Array.<Controls/gridReact:IHeaderConfig>}
     * @example
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *     staticHeaders: [
     *         {
     *             key: 'staticHeader',
     *             render: ...,
     *         },
     *     ],
     * }
     * </pre>
     *
     * В параметре render нужно указать шаблон отрисовки, например:
     *
     * <pre class="brush: js">
     * import * as React from 'react';
     * import { RangeSelectorConnectedComponent } from 'Controls-Lists/timelineGrid';
     *
     * function StaticHeaderRender(): React.ReactElement {
     *     return (
     *         <RangeSelectorConnectedComponent
     *             storeId="EmployeeList"
     *             fontColorStyle={'primary'}
     *         />
     *     );
     * }
     * </pre>
     */
    staticHeaders: IHeaderConfig[];
    /**
     * Параметры статичных колонок подвала
     * @cfg {Array.<Controls/gridReact:IFooterConfig>}
     */
    staticFooter?: IFooterConfig[];
    /**
     * Параметры динамических колонок
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicColumnConfig}
     * @example
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *     dynamicColumn: {
     *         displayProperty: 'dynamicTitle',
     *         minWidth: '20px',
     *         render: ...,
     *     };
     * }
     * </pre>
     *
     * В параметре render нужно указать шаблон отрисовки, например:
     *
     * <pre class="brush: js">
     * import * as React from 'react';
     *
     * function DemoDynamicColumnComponent(props): React.ReactElement {
     *     const { item, columnData, date } = props;
     *     let dynamicTitle = columnData.get('dynamicTitle');
     *     return <span className="ControlsLists-dynamicGrid__dynamicCellComponent">{dynamicTitle}</span>;
     * }
     * </pre>
     */
    dynamicColumn: IDynamicColumnConfig<TColumnsGridData>;
    /**
     * Параметры заголовков динамических колонок.
     * @cfg {Controls/gridReact:IHeaderConfig}
     * @example
     * В следующем примере ячейки заголовков динамических колонок будут залиты в цвет danger
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *     dynamicHeader: {
     *         getCellProps(item: Model, date: Date): ICellProps {
     *             return {
     *                 backgroundStyle: 'danger',
     *             };
     *         };
     *     }
     * }
     * </pre>
     */
    dynamicHeader: IHeaderConfig;
    /**
     * Параметры подвала динамических колонок
     * @cfg {Controls/gridReact:IFooterConfig}
     */
    dynamicFooter?: IFooterConfig;
    /**
     * Параметры навигации по колонкам.
     * @cfg {Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments/IDynamicColumnsNavigation}
     * @example
     * На приведённой конфигурации поле dynamicColumnsData бужет использовано при формирования фильтра для горизонтальной навигации и последующей передаче в RecordSet данных динамических колонок.
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *    ...,
     *    columnsNavigation: {
     *       sourceConfig: {
     *            field: 'dynamicColumnsData',
     *            direction: 'bothways',
     *            limit: '90',
     *            position: new Date(2023, 0, 1),
     *        },
     *    },
     * }
     * </pre>
     * @see /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/
     */
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
}
