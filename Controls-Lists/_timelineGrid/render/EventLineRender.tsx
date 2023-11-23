import * as React from 'react';

/**
 * Отступ, который всегда прибавляется к отступу "колбаски" сверху
 */
const defaultTopOffset = '20px';

/**
 * Интерфейс конфигурации события "Таймлайн таблицы" в виде линии ("колбаски").
 * @demo Controls-Lists-demo/timelineGrid/EventRender/WI/EventLineRender
 * @public
 */
export interface IEventRenderProps {
    /**
     * Передаваемые классы
     */
    className?: string;
    /**
     * Цвет заливки линии
     * @default default
     */
    backgroundColorStyle?: string;
    /**
     * Рамка линии сверху
     */
    borderTopColorStyle?: string;
    /**
     * Рамка линии снизу
     */
    borderBottomColorStyle?: string;
    /**
     * Рамка линии снизу
     */
    borderLeftColorStyle?: string;
    /**
     * Рамка линии справа
     */
    borderRightColorStyle?: string;
    /**
     * Текстовая подсказка при ховере
     */
    title: string;
    /**
     * Отступ сверху. По умолчанию к нему всегда добавляется + 20px;
     * @default '0px'
     */
    topOffset?: string;
    /**
     * Селектор для тестирования
     */
    dataQa?: string;
    zIndex?: number;
}

/**
 * Событие "Таймлайн таблицы" в виде линии ("колбаски").
 * @param props Конфигурация компонента.
 */
function EventRender(props: IEventRenderProps) {
    const {
        className,
        title,
        backgroundColorStyle,
        borderTopColorStyle,
        borderBottomColorStyle,
        borderLeftColorStyle,
        borderRightColorStyle,
        topOffset,
        zIndex,
    } = props;
    return (
        <div
            title={title}
            data-qa={props.dataQa}
            style={{
                zIndex,
                marginTop: `calc(${topOffset} + ${defaultTopOffset})`,
            }}
            className={
                'ControlsLists-timelineGrid__EventLineRender ' +
                `controls-background-${backgroundColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-top-${borderTopColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-bottom-${borderBottomColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-left-${borderLeftColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-right-${borderRightColorStyle} ` +
                `${className} `
            }
        />
    );
}

EventRender.defaultProps = {
    className: '',
    title: '',
    topOffset: '0px',
    backgroundColorStyle: 'default',
    borderTopColorStyle: '',
    borderBottomColorStyle: '',
    borderLeftColorStyle: '',
    borderRightColorStyle: '',
    zIndex: 1,
};

export default React.memo(EventRender);
