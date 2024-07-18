/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Icon } from 'Controls/icon';
import { Logger } from 'UI/Utils';
import { calcEventRelativeBlockStyles } from 'Controls-Lists/_timelineGrid/render/utils';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';

/**
 * Отступ, который всегда прибавляется к отступу "колбаски" сверху
 */
const defaultTopOffset = '20px';

type TSubEvent = { [name: string]: Date };

/**
 * Параметры отрисовки подсобытий внутри события-линии
 * @interface Controls-Lists/_timelineGrid/render/EventLineRender/IInnerLineEventsProps
 * @public
 */
interface IInnerLineEventsProps {
    /**
     * Дата старта основного события для рассчёта позиции внутренних событий
     */
    eventStart?: Date;
    /**
     * Дата старта основного события для рассчёта позиции внутренних событий
     */
    eventEnd?: Date;
    /**
     * Внутренние события, отображаемые в виде тонких линий поверх линии
     */
    subEvents?: TSubEvent[];
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату начала события
     */
    eventStartProperty?: string;
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату окончания события
     */
    eventEndProperty?: string;
    /**
     * Рассчитанная на уровне ячейки события таймлайн таблицы щирина блока события
     */
    width?: string;
    topOffset?: string;
}

/**
 * Интерфейс конфигурации компонента для отрисовки события "Таймлайн таблицы" в виде линии ("колбаски").
 * @interface Controls-Lists/_timelineGrid/render/EventLineRender/IEventRenderProps
 * @public
 */
export interface IEventRenderProps extends IInnerLineEventsProps {
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

function validateProps(props: IInnerLineEventsProps): boolean {
    const failedProps: string[] = [];
    ['eventStart', 'eventEnd', 'eventStartProperty', 'eventEndProperty', 'width'].forEach(
        (prop) => {
            if (props[prop] === undefined) {
                failedProps.push(prop);
            }
        }
    );
    if (failedProps.length) {
        Logger.error(
            `Required properties ${failedProps.join(
                ', '
            )} are not set for IInnerEvents. Either add required properties or stop using subEvents`
        );
        return false;
    }
    return true;
}

function IInnerEvents(props: IInnerLineEventsProps): React.ReactElement | null {
    const { quantum, range } = React.useContext(TimelineDataContext);
    if (!validateProps(props)) {
        return null;
    }
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {props.subEvents?.map((event: TSubEvent) => {
                const subEventStyle = calcEventRelativeBlockStyles({
                    quantum,
                    range,
                    block: event,
                    blockStartProperty: props.eventStartProperty as string,
                    blockEndProperty: props.eventEndProperty as string,
                    eventStart: props.eventStart as Date,
                    isRelativeToCell: false,
                });
                subEventStyle.top = props.topOffset;
                return (
                    <div
                        style={subEventStyle}
                        className={
                            'ControlsLists-timelineGrid__EventLineRender_subEvent ' +
                            'controls-background-default ' +
                            'ControlsLists-timelineGrid__EventLineRender_size-s'
                        }
                    />
                );
            })}
        </>
    );
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
                'ControlsLists-timelineGrid__EventLineRender_size-m ' +
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
                    className={
                        'js-ControlsLists-timelineGrid__Event_icon ControlsLists-timelineGrid__EventLineRender_icon ' +
                        `ControlsLists-timelineGrid__EventLineRender_icon_with${
                            borderTopColorStyle ? '' : 'out'
                        }Border`
                    }
                />
            )}
            {props.subEvents ? (
                <IInnerEvents
                    subEvents={props.subEvents}
                    eventEndProperty={props.eventEndProperty}
                    eventStartProperty={props.eventStartProperty}
                    eventStart={props.eventStart}
                    eventEnd={props.eventEnd}
                    width={props.width}
                    topOffset={props.borderTopColorStyle ? '0px' : 'var(--offset_3xs)'}
                />
            ) : null}
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
