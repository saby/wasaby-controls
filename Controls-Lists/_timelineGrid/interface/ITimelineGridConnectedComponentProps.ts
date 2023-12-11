import { IDynamicGridConnectedComponentProps } from 'Controls-Lists/dynamicGrid';

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
    aggregationRender?: JSX.Element;
    autoColspanHeaders?: boolean;
    /**
     * Режим отображения горизонтальных разделителей
     * @default spacing
     */
    horizontalSeparatorsMode?: TSeparatorMode;
    /**
     * Режим отображения вертикальных разделителей
     * @default spacing
     */
    verticalSeparatorsMode?: TSeparatorMode;
}
