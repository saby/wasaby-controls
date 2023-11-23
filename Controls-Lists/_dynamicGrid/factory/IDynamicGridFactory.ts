import type { IColumnConfig, IHeaderConfig, IFooterConfig } from 'Controls/gridReact';
import type { IListDataFactoryArguments, IDataFactory } from 'Controls/dataFactory';
import type { TNavigationDirection } from 'Controls/interface';
import {
    TCellsMultiSelectAccessibilityCallback,
    TCellsMultiSelectVisibility,
    ISelection,
} from '../selection/SelectionContainer';
import { IDynamicColumnConfig } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';

/**
 * Интерфейс параметров работы с источником данных.
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridFactory/IDynamicColumnsNavigationSourceConfig
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
     */
    position?: TPosition;
}

/**
 * Интерфейс параметров навигации по динамически генерируемым колонкам
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridFactory/IDynamicColumnsNavigation
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
 * @interface Controls-Lists/_dynamicGrid/factory/IDynamicGridFactory
 * @extends Controls/_dataFactory/List/_interface/IListDataFactoryArguments
 * @public
 */
export interface IDynamicGridDataFactoryArguments<
    TNavigationPosition = number,
    TColumnsGridData = number
> extends IListDataFactoryArguments {
    /**
     * Статически отображаемые колонки
     * @example
     * <pre class="brush:js">
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
     */
    staticColumns: IColumnConfig[];
    /**
     * Статически отображаемые заголовки
     * @example
     * <pre class="brush:js">
     * dataFactoryArguments: {
     *     staticHeaders: [
     *         {
     *             key: 'staticHeader',
     *             render: ...,
     *         },
     *     ],
     * }
     * </pre>
     */
    staticHeaders: IHeaderConfig[];
    /**
     * Статически отображаемые колонки подвала
     */
    staticFooter?: IFooterConfig[];
    /**
     * Параметры отображения динамической колонки
     */
    dynamicColumn: IDynamicColumnConfig<TColumnsGridData>;
    /**
     * Параметры отображения заголовка динамической колонки
     * @example
     * <pre class="brush:js">
     * dataFactoryArguments: {
     *     dynamicColumn: {
     *         displayProperty: 'dynamicTitle',
     *         minWidth: '20px',
     *         render: ...,
     *     };
     * }
     * </pre>
     */
    dynamicHeader: IHeaderConfig;
    /**
     * Параметры отображения подвала динамической колонки
     */
    dynamicFooter?: IFooterConfig;
    /**
     * Параметры навигации по колонкам.
     */
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
    /**
     * Видимость множественноо выбора ячеек
     */
    cellsMultiSelectVisibility?: TCellsMultiSelectVisibility;
    /**
     * Функция, позволяющая определить доступность множественноо выбора для конкретных ячеек
     * @cfg {Controls-Lists/_dynamicGrid/TMultiSelectAccessibilityCallback.typedef}
     * @example
     * <pre class="brush:js">
     * import { MultiSelectAccessibility } from 'Controls/display';
     *
     * dataFactoryArguments: {
     *     cellsMultiSelectAccessibilityCallback: (itemKey, columnKey) => {
     *         return (itemKey === 6 || itemKey === '6') &&
     *                new Date(columnKey) < new Date('Mon, 23 Jan 2023 21:00:00 GMT') ?
     *            MultiSelectAccessibility.hidden :
     *            return MultiSelectAccessibility.enabled;
     *    },
     * }
     * </pre>
     */
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
    /**
     * Объект с выбранными ячейками.
     * В качестве ключей принимает ключ записи, а в качестве значений - массив ключей динамических колонок
     * @cfg {Record<Types/source:CrudEntityKey, Controls/gridReact:TColumnKey[]>}
     * @example
     * <pre class="brush:js">
     *     dataFactoryArguments: {
     *          ...,
     *          selectedCells: {
     *              2: [
     *                  'Sat, 07 Jan 2023 21:00:00 GMT',
     *                  'Sun, 08 Jan 2023 21:00:00 GMT',
     *                  'Mon, 09 Jan 2023 21:00:00 GMT',
     *                  'Thu, 12 Jan 2023 21:00:00 GMT',
     *              ],
     *              3: ['Sat, 07 Jan 2023 21:00:00 GMT', 'Sun, 08 Jan 2023 21:00:00 GMT'],
     *              4: [
     *                  'Sat, 07 Jan 2023 21:00:00 GMT',
     *                  'Sun, 08 Jan 2023 21:00:00 GMT',
     *                  'Wed, 11 Jan 2023 21:00:00 GMT',
     *                  'Thu, 12 Jan 2023 21:00:00 GMT',
     *              ],
     *          },
     *     }
     * </pre>
     */
    selectedCells?: ISelection;
    /**
     * Имя свойства записи, содержщего данные для рендера динамических колонок.
     */
    dynamicColumnsDataProperty?: string;
}

export type IDynamicGridDataFactory = IDataFactory<unknown, IDynamicGridDataFactoryArguments>;
