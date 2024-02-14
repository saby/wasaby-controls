/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { Icon } from 'Controls/icon';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { TFontSize, TOffsetSize } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import { getPositionInPeriod } from 'Controls-Lists/dynamicGrid';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';

/**
 * Скос блока события
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventBlockRender/TBevel
 * @variant top У события будет срезан верхний угол
 * @variant bottom У события будет срезан нижний угол
 */
export type TBevel = 'top' | 'bottom' | null;

/**
 * Режим взаимодействия пользователя с событием
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventBlockRender/TEventInteractionMode
 * @variant block События ховера и клика происходят на блоке
 * @variant content События ховера и клика происходят на содержимом блока (текст, иконка).
 * @variant none События ховера и клика не обрабатываются блоком.
 */
export type TEventInteractionMode = 'block' | 'content' | 'none';

/**
 * Размещение содержимого внутри блока события
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventBlockRender/TAlign
 * @variant left Слева
 * @variant center По центру
 * @variant right Справа
 */
export type TAlign = 'left' | 'center' | 'right';

/**
 * Перехлёст содержимого, если оно не умещается внутри блока события
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventBlockRender/TOverflow
 * @variant visible Контент выходит за рамки события.
 * @variant ellipsis Контент обрезается с многоточием.
 * @variant hidden Контент обрезается.
 */
export type TOverflow = 'visible' | 'ellipsis' | 'hidden';

/**
 * Интерфейс конфигурации компонента для отрисовки события "Таймлайн таблицы" в виде блока, растянутого на всю высоту ячейки.
 * @interface Controls-Lists/_timelineGrid/render/EventBlockRender/IEventRenderProps
 * @public
 */
export interface IEventRenderProps {
    /**
     * Передаваемые классы
     * @cfg {String}
     */
    className?: string;
    /**
     * Иконка события
     * @cfg {String}
     */
    icon?: string;
    /**
     * Заголовок события
     * @cfg {String}
     */
    caption?: string;
    /**
     * Текстовая подсказка при ховере
     * @cfg {String}
     */
    title?: string;
    /**
     * Описание события
     * @cfg {String|ReactElement}
     */
    description?: string | JSX.Element;
    /**
     * Размер шрифта текста.
     * @cfg {Controls/interface:TFontSize}
     * @default 3xs
     */
    fontSize?: TFontSize;
    /**
     * Настройка базовой линии для выравивания контента внутри события.
     * @cfg {Controls/interface:TFontSize}
     */
    baseline?: TFontSize;
    // offset нужен , чтобы было видно тип дня.
    // Например, смена поверх отпуска. Нужно у смены добавлять отступ.
    /**
     * Отступ от края ячейки.
     * @cfg {Controls/interface:TOffsetSize}
     */
    offset?: TOffsetSize;
    /**
     * Цвет шрифта и иконки.
     * @cfg {String}
     * @default default
     */
    fontColorStyle?: string;
    /**
     * Цвет штриховки пересечения событий
     * @cfg {String}
     */
    hatchColorStyle?: string;
    /**
     * Стиль фона события.
     * @cfg {String}
     * @default default
     */
    backgroundColorStyle?: string;
    /**
     * Цвет полос штриховки фона события
     * @cfg {String}
     */
    stripesColorStyle?: string;
    /**
     * Размещение иконки и текста внутри блока
     * @cfg {Controls-Lists/_timelineGrid/render/EventBlockRender/TAlign.typedef}
     * @default left
     */
    align: TAlign;
    /**
     * Поведение контента при нехватке места - виден полностью или подстраивается под ширину.
     * @cfg {Controls-Lists/_timelineGrid/render/EventBlockRender/TOverflow.typedef}
     * @default hidden
     */
    overflow: TOverflow;
    /**
     * Ширина блока события
     * @cfg {Number}
     */
    width: number;
    contentOffset: number;
    /**
     * Скос блока события слева
     * @cfg {Controls-Lists/_timelineGrid/render/EventBlockRender/TBevel.typedef}
     * @default null
     */
    leftBevel: TBevel;
    /**
     * Скос блока события справа
     * @cfg {Controls-Lists/_timelineGrid/render/EventBlockRender/TBevel.typedef}
     * @default null
     */
    rightBevel: TBevel;
    /**
     * Массив диапазонов пересечения событий
     * @cfg {Array.<Controls-Lists/_timelineGrid/render/EventBlockRender/IIntersection>}
     * @see eventStart
     */
    intersections?: IIntersection[];
    /**
     * Дата старта события для рассчёта пересечений
     * @cfg {Date}
     * @see intersections
     */
    eventStart: Date;
    readOnly: boolean;
    /**
     * Селектор для тестирования
     * @cfg {String}
     */
    dataQa?: string;
    /**
     * Режим взаимодействия с событием
     * @cfg {Controls-Lists/_timelineGrid/render/EventBlockRender/TEventInteractionMode.typedef}
     * @default content
     */
    interactionMode?: TEventInteractionMode;
}

/**
 * Диапазон пересечения событий.
 * @interface Controls-Lists/_timelineGrid/render/EventBlockRender/IIntersection
 * @public
 */
export interface IIntersection {
    /**
     * Дата начала пересечения
     */
    start: Date;
    /**
     * Дата окончания пересечения
     */
    end: Date;
}

const ICON = 16;
const SPACING = 4;

const MILLISECONDS = 1000;
const MINUTES = 3600;
const HOURS = 24;

/**
 * Значения, возвращаемые утилитой getEventFittingMode
 * @typedef Controls-Lists/_timelineGrid/render/EventBlockRender/TFittingMode
 * @variant caption помещается все
 * @variant description заголовок не помещается, но помещается описание
 * @variant icon помещается только иконка
 * @variant '' ничего не помещается
 * @see getEventFittingMode
 */
export type TFittingMode = 'caption' | 'description' | 'icon' | '';

/**
 * Метод для расчёта, какие части события помещаются в заданную ширину:
 * Если помещается не все, то сначала уходит заголовок, потом описание, потом иконка
 * Если помещается все, то возвращает 'caption'
 * Если заголовок не помещается, но помещается описание, то 'description'
 * Если только иконка, то 'icon'
 * Если ничего, то ''
 * @param width Ширина, в которую необходимо уместить элементы вёрстки события.
 * @param iconWidth Ширина иконки
 * @param caption Заголовок
 * @param description Описание
 * @param fontSize Размер шрифта из стандартной линейки размеров
 * @param iconSpace Место под иконку
 * @param offsetSpace Размер отступа до события
 * @returns {Controls-Lists/_timelineGrid/render/EventBlockRender/TFittingMode.typedef}
 */
export function getEventFittingMode(
    width: number,
    iconWidth: number,
    caption: string,
    description: string | JSX.Element,
    fontSize: TFontSize,
    iconSpace: number,
    offsetSpace: number
): TFittingMode {
    const captionWidth = getFontWidth(caption + ' ', fontSize);
    const descriptionWidth =
        typeof description === 'string' ? getFontWidth(description, fontSize) : 0;
    if (width > iconWidth + descriptionWidth + captionWidth + offsetSpace + iconSpace) {
        return 'caption';
    }
    if (description && width > iconWidth + descriptionWidth + offsetSpace + iconSpace) {
        return 'description';
    }
    if (width > iconWidth + offsetSpace) {
        return 'icon';
    }
    return '';
}

function calculatePeriodOffset(startDate: Date, endDate: Date, quantum): number {
    if (quantum === 'day') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const diffDays = timeDiff / (MILLISECONDS * MINUTES * HOURS);
        return diffDays;
    }
    if (quantum === 'hour') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const hoursDiff = timeDiff / (MILLISECONDS * MINUTES);
        return hoursDiff;
    }
    if (quantum === 'month') {
        const startPosition = getPositionInPeriod(startDate, quantum);
        const monthsDiff = endDate.getMonth() - startDate.getMonth();
        return monthsDiff - startPosition;
    }
}

/**
 * Классы для отрисовки скоса блока события
 * @param props
 */
function getBevelClassName(props: IEventRenderProps): string {
    const { leftBevel, rightBevel } = props;
    if (leftBevel && rightBevel) {
        return ` ControlsLists-timelineGrid__EventBlockRender_bevel-left-${leftBevel}-right-${rightBevel}`;
    }
    if (leftBevel) {
        return ` ControlsLists-timelineGrid__EventBlockRender_bevel-left-${leftBevel}`;
    }
    if (rightBevel) {
        return ` ControlsLists-timelineGrid__EventBlockRender_bevel-right-${rightBevel}`;
    }
    return '';
}

/**
 * Классы для отрисовки штриховки
 * @param props
 */
function getHatchClassName(props: IEventRenderProps): string {
    const { hatchColorStyle, intersections } = props;
    let hatchClass = '';
    if (intersections && intersections?.length > 0) {
        if (!hatchColorStyle) {
            Logger.error('Should set hatchColorStyle');
            return null;
        } else {
            hatchClass = `controls-hatch_color-${hatchColorStyle} `;
        }
    }
    return hatchClass;
}

/**
 * Классы для блока события
 * @param props
 */
function getEventBlockClassName(props: IEventRenderProps) {
    const { fontSize, fontColorStyle, align, overflow, offset, readOnly, interactionMode } = props;
    let className =
        'ControlsLists-timelineGrid__EventBlockRender ' +
        'ControlsLists-timelineGrid__EventBlockRender_white-space ' +
        `tw-justify-${align} ` +
        `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
        `controls-padding_top-${offset} controls-padding_bottom-${offset} ` +
        `${getHatchClassName(props)}` +
        `controls-fontsize-${fontSize} ` +
        (readOnly ? 'ControlsLists-timelineGrid__EventBlockRender_readOnly ' : '') +
        `controls-text-${fontColorStyle} ${props.className} ` +
        `${getBevelClassName(props)}`;
    className += ` ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
        interactionMode === 'block' ? 'auto' : 'none'
    }`;
    return className;
}

export default function EventBlockRender(props: IEventRenderProps): React.ReactElement {
    const {
        icon,
        caption,
        title,
        description,
        fontSize,
        baseline,
        fontColorStyle,
        backgroundColorStyle,
        stripesColorStyle,
        overflow,
        width,
        contentOffset,
        intersections,
        eventStart,
    } = props;
    const fittingMode = React.useMemo(
        () =>
            overflow === 'hidden'
                ? getEventFittingMode(
                      width,
                      icon ? ICON : 0,
                      caption,
                      description,
                      fontSize,
                      SPACING,
                      SPACING
                  )
                : 'caption',
        [width, icon, caption, description, fontSize, overflow]
    );

    const { quantum, range } = React.useContext(TimelineDataContext);

    const calculateIntersectionLeftOffset = (eventStart: Date, intersectionStart: Date): number => {
        return (
            calculatePeriodOffset(eventStart, intersectionStart, quantum) +
            getPositionInPeriod(intersectionStart, quantum)
        );
    };

    const calculateIntersectionWidth = (
        eventStart: Date,
        intersectionStart: Date,
        intersectionEnd: Date
    ): number => {
        return (
            calculatePeriodOffset(intersectionStart, intersectionEnd, quantum) -
            getPositionInPeriod(intersectionStart, quantum) +
            getPositionInPeriod(intersectionEnd, quantum)
        );
    };

    const className = getEventBlockClassName(props);

    const contentLeftMargin = props.leftBevel ? 'm' : '2xs';
    const contentRightMargin = '2xs';

    return (
        <div
            className={className}
            style={{
                paddingLeft: contentOffset,
            }}
            data-qa={props.dataQa}
        >
            <div
                data-qa={'EventBlockRender-background'}
                className={
                    'ControlsLists-timelineGrid__EventBlockRender_bg ' +
                    `controls-background-${backgroundColorStyle} ` +
                    (stripesColorStyle
                        ? `ControlsLists-timelineGrid__EventBlockRender_stripes ControlsLists-timelineGrid__EventBlockRender_stripes-${stripesColorStyle} `
                        : '') +
                    'ControlsLists-timelineGrid__EventBlockRender_bg-right_null '
                }
            />
            {intersections?.map((intersection) => {
                let eventStartCropped = eventStart;
                if (range.start > eventStart) {
                    eventStartCropped = range.start;
                }
                let intersectionStartCropped = intersection.start;
                if (range.start > intersection.start) {
                    intersectionStartCropped = range.start;
                }
                let intersectionEndCropped = intersection.end;
                if (range.end < intersection.start) {
                    intersectionEndCropped = range.end;
                }
                const intersectionStyle = {
                    left: `calc((var(--dynamic-column_width) + var(--dynamic-column_gap)) *
                     ${calculateIntersectionLeftOffset(
                         eventStartCropped,
                         intersectionStartCropped
                     )})`,
                    width: `calc(((var(--dynamic-column_width) + var(--dynamic-column_gap)) * ${calculateIntersectionWidth(
                        eventStartCropped,
                        intersectionStartCropped,
                        intersectionEndCropped
                    )} - var(--dynamic-column_gap))`,
                };
                return (
                    <div
                        key={intersection.start.toISOString()}
                        data-qa={'EventBlockRender-intersection'}
                        className="ControlsLists-timelineGrid__EventBlockRender_intersection"
                        style={intersectionStyle}
                    />
                );
            })}

            <span
                title={title}
                data-qa={'EventBlockRender-content'}
                className={
                    'controls-GridReact__cell-baseline ' +
                    `controls-GridReact__cell-baseline_${baseline} ` +
                    'ControlsLists-timelineGrid__EventBlockRender_text ' +
                    `controls-margin_left-${contentLeftMargin} ` +
                    `controls-margin_right-${contentRightMargin} ` +
                    `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                    `ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
                        props.interactionMode !== 'content' ? 'none' : 'auto'
                    }`
                }
            >
                {icon && fittingMode ? (
                    <Icon
                        icon={icon}
                        dataQa={icon}
                        iconStyle={fontColorStyle}
                        iconSize={'s'}
                        className="ControlsLists-timelineGrid__EventBlockRender_icon"
                    />
                ) : null}
                {caption && fittingMode === 'caption' ? caption + ' ' : null}
                {description && (fittingMode === 'caption' || fittingMode === 'description')
                    ? description
                    : null}
            </span>
        </div>
    );
}

EventBlockRender.defaultProps = {
    className: '',
    icon: '',
    caption: '',
    description: '',
    fontSize: '3xs',
    contentOffset: 'null',
    fontColorStyle: 'default',
    backgroundColorStyle: 'default',
    stripesColorStyle: '',
    align: 'left',
    overflow: 'hidden',
    interactionMode: 'content',
};

export const MemoizedEventBlockRender = React.memo(EventBlockRender);

/**
 * Компонент для отрисовки события "Таймлайн таблицы" в виде блока, растянутого на всю высоту ячейки.
 * @class Controls-Lists/_timelineGrid/render/EventBlockRender
 * @implements Controls-Lists/_timelineGrid/render/EventBlockRender/IEventRenderProps
 * @demo Controls-Lists-demo/timelineGrid/EventRender/WI/EventBlockRender
 * @public
 */
