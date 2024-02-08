/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { Icon } from 'Controls/icon';

/**
 * Отступ, который всегда прибавляется к отступу "колбаски" сверху
 */
const defaultTopOffset = '20px';

/**
 * Интерфейс конфигурации компонента для отрисовки события "Таймлайн таблицы" в виде линии ("колбаски").
 * @interface Controls-Lists/_timelineGrid/render/EventLineRender/IEventRenderProps
 * @public
 */
export interface IEventRenderProps {
    /**
     * Передаваемые классы
     * @cfg {String}
     */
    className?: string;
    /**
     * Цвет заливки линии
     * @cfg {String}
     * @default default
     */
    backgroundColorStyle?: string;
    /**
     * Рамка линии сверху
     * @cfg {String}
     */
    borderTopColorStyle?: string;
    /**
     * Рамка линии снизу
     * @cfg {String}
     */
    borderBottomColorStyle?: string;
    /**
     * Рамка линии снизу
     * @cfg {String}
     */
    borderLeftColorStyle?: string;
    /**
     * Рамка линии справа
     * @cfg {String}
     */
    borderRightColorStyle?: string;
    /**
     * Текстовая подсказка при ховере
     * @cfg {String}
     */
    title: string;
    /**
     * Иконка, выводимая над событием
     * @cfg {String}
     */
    icon?: string;
    /**
     * Цвет иконки, выводимая над событием
     * @cfg {String}
     */
    iconStyle?: string;
    /**
     * Отступ сверху. По умолчанию к нему всегда добавляется + 20px;
     * @cfg {String}
     * @default '0px'
     */
    topOffset?: string;
    /**
     * Селектор для тестирования
     * @cfg {String}
     */
    dataQa?: string;
    zIndex?: number;
}

export default function EventLineRender(props: IEventRenderProps) {
    const {
        className,
        title,
        icon,
        iconStyle,
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
        >
            {icon && (
                <Icon
                    icon={icon}
                    dataQa={icon}
                    iconStyle={iconStyle || 'secondary'}
                    iconSize={'s'}
                    className="js-ControlsLists-timelineGrid__Event_icon ControlsLists-timelineGrid__EventLineRender_icon"
                />
            )}
        </div>
    );
}

EventLineRender.defaultProps = {
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

export const MemoizedEventLineRender = React.memo(EventLineRender);

/**
 * Компонент для отрисовки события "Таймлайн таблицы" в виде линии ("колбаски").
 * @class Controls-Lists/_timelineGrid/render/EventLineRender
 * @implements Controls-Lists/_timelineGrid/render/EventLineRender/IEventRenderProps
 * @demo Controls-Lists-demo/timelineGrid/EventRender/WI/EventLineRender
 * @public
 */
