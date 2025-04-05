/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { StickyBlock } from 'Controls/stickyBlock';
import { TimeMarkerTriangle } from 'Controls-Lists/_dynamicGrid/render/TimeMarkerTriangle';
import { TimeMarkerLine } from 'Controls-Lists/_dynamicGrid/render/TimeMarkerLine';

/**
 * Свойства компонента TimeMarker.
 * @public
 * @param props {ITimeMarkerProps}
 */
interface ITimeMarkerProps {
    /**
     * Кастомный CSS-класс для стилизации маркера времени.
     * @cfg
     */
    className?: string;
    /**
     * Инлайн-стили для обертки маркера времени.
     * @cfg
     */
    style?: React.CSSProperties;
    /**
     * Текст, отображаемый внутри треугольного маркера.
     * @cfg
     */
    markerContentRender?: string;
    /**
     * Инлайн-стили для линии маркера времени.
     * @cfg
     */
    lineStyle?: React.CSSProperties;
}

/**
 * Контрол - маркер текущего времени
 * @param props {ITimeMarkerProps}
 * @author Лебедев С.
 */
function TimeMarker({ style, className, markerContentRender, lineStyle }: ITimeMarkerProps) {
    const leftPadding = !markerContentRender
        ? 'calc(-1 * var(--date-triangle_border_width) + 1px)'
        : '0';
    return (
        <div
            style={{ position: 'absolute', ...style }}
            className={`ControlsLists-dateLine__variables ${className ? `+${className}` : ''}`}
        >
            <TimeMarkerTriangle text={markerContentRender} style={{ left: leftPadding }} />
            <TimeMarkerLine style={lineStyle} />
        </div>
    );
}

export default TimeMarker;
