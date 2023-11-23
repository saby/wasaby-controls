import { IDynamicGridConnectedComponentProps } from 'Controls-Lists/dynamicGrid';
import { TDynamicColumnMinWidths } from 'Controls-Lists/_timelineGrid/utils';

/**
 * Режимы отображения разделителей строк и колонок в таймлайн таблице
 * @typedef {String} Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators
 * @variant none Элементы расположены без разделителей и отступов
 * @variant gap Промежуток между элементами
 * @variant line Сплошная линия по вериткали или по горизонтали
 */
export type TSeparatorMode = 'none' | 'gap' | 'line';

/**
 * Интерфейс свойств компонента таймлайн-таблицы
 * @interface Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps
 */
export interface ITimelineGridConnectedComponentProps extends IDynamicGridConnectedComponentProps {
    /**
     * Рендер содержимого для колонки итогов по строкам (Агрегат по колонкам)
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridFactory#aggregationVisibility
     */
    aggregationRender?: JSX.Element;
    /**
     * Конфигурация минимальных ширин колонок для различных квантов времени.
     * @cfg {Controls-Lists/_timelineGrid/utils/TDynamicColumnMinWidths.typedef}
     */
    dynamicColumnMinWidths?: TDynamicColumnMinWidths;
    /**
     * Режим отображения горизонтальных разделителей
     * @cfg {Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators.typedef}
     * @default spacing
     */
    horizontalSeparatorsMode?: TSeparatorMode;
    /**
     * Режим отображения вертикальных разделителей
     * @cfg {Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps/TSeparators.typedef}
     * @default spacing
     */
    verticalSeparatorsMode?: TSeparatorMode;
    allowHourQuantum?: boolean;
}
