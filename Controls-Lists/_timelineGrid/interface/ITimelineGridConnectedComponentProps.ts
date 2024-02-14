import { IDynamicGridConnectedComponentProps } from 'Controls-Lists/dynamicGrid';
import { TDynamicColumnMinWidths, TAvailableQuantums } from 'Controls-Lists/_timelineGrid/utils';

/**
 * Режимы отображения разделителей строк и колонок в таймлайн таблице
 * @typedef {String} Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators
 * @variant none Элементы расположены без разделителей и отступов
 * @variant gap Промежуток между элементами
 * @variant line Сплошная линия по вериткали или по горизонтали
 */
export type TSeparatorMode = 'none' | 'gap' | 'line';

/**
 * Интерфейс конфигурации компонента таймлайн-таблицы
 * @interface Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps
 * @extends Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @public
 */
export interface ITimelineGridConnectedComponentProps extends IDynamicGridConnectedComponentProps {
    /**
     * Рендер содержимого для дополнительной колонки
     * @cfg {react.ReactElement}
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#aggregationVisibility
     * @see Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/useAggregationData
     */
    aggregationRender?: JSX.Element;
    /**
     * Конфигурация минимальных ширин колонок для различных квантов времени. Значения минимальных ширин колонок используются при определении {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#range диапазона отображаемых колонок}.
     * @cfg {Controls-Lists/_timelineGrid/utils/TDynamicColumnMinWidths.typedef}
     * @example
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *     dynamicColumnMinWidths: {
     *         day: '35px',
     *         month: '35px',
     *         hour: '100px',
     *     },
     * }
     * </pre>
     * @see Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps#viewportWidth viewportWidth
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#range range
     */
    dynamicColumnMinWidths?: TDynamicColumnMinWidths;
    /**
     * Режим отображения горизонтальных разделителей
     * @cfg {Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators.typedef}
     * @default gap
     */
    horizontalSeparatorsMode?: TSeparatorMode;
    /**
     * Режим отображения вертикальных разделителей
     * @cfg {Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators.typedef}
     * @default gap
     */
    verticalSeparatorsMode?: TSeparatorMode;
    /**
     * Значения квантов для ограничения работы "Таймлайн таблицы" с заданными временными промежутками.
     * @cfg {Array<Controls-Lists/timelineGrid/Quantum.typedef>}
     * @default null
     */
    availableQuantums?: TAvailableQuantums;
}
