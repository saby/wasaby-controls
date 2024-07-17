/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Icon } from 'Controls/icon';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import {
    TFontSize,
    TOffsetSize,
    THorizontalAlign,
    TIconSize,
    TIconStyle,
    ITagProps,
} from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';
import { calcEventRelativeBlockStyles } from 'Controls-Lists/_timelineGrid/render/utils';
import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';

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
 * @variant start Слева
 * @variant center По центру
 * @variant end Справа
 */
export type TAlign = 'start' | 'center' | 'end';

/**
 * Поведение содержимого при переполнении блока события.
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventBlockRender/TOverflow
 * @variant visible Контент выходит за рамки события.
 * @variant ellipsis Контент обрезается с многоточием.
 * @variant hidden Контент обрезается.
 * @variant byWidth Контент скрывается частями в зависимости от переданной ширины.
 */
export type TOverflow = 'visible' | 'ellipsis' | 'hidden' | 'byWidth';

/**
 * Интерфейс конфигурации компонента для отрисовки события "Таймлайн таблицы" в виде блока, растянутого на всю высоту ячейки.
 * @interface Controls-Lists/_timelineGrid/render/EventBlockRender/IEventRenderProps
 * @public
 */
export interface IEventRenderProps extends ITagProps {
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
     * Размер иконки
     * @cfg {String}
     */
    iconSize?: TIconSize;
    /**
     * Стиль иконки
     * @cfg {String}
     */
    iconStyle?: TIconStyle;
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
     * @cfg {Controls/interface:TOffsetSize.typedef}
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
     * @cfg {Controls/interface:THorizontalAlign}
     * @default left
     */
    align: THorizontalAlign;
    /**
     * Поведение содержимого при переполнении блока события. Виден полностью или подстраивается под ширину.
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
    /**
     * Подсказка при наведении на тег.
     * @cfg {String}
     */
    tagTooltip?: string;
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
 * Метод для расчёта, какие части события помещаются в заданную ширину.
 * @remark
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
    className += ` ControlsLists-timelineGrid__EventBlockRender_pointerEvents${
        interactionMode === 'block' ? '_auto' : ''
    }`;
    return className;
}

export default function EventBlockRender(props: IEventRenderProps): React.ReactElement {
    const {
        icon,
        iconStyle,
        iconSize,
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
            overflow === 'byWidth' || overflow === 'hidden'
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
                const intersectionStyle = calcEventRelativeBlockStyles({
                    quantum,
                    range,
                    block: intersection,
                    blockStartProperty: 'start',
                    blockEndProperty: 'end',
                    eventStart,
                    isRelativeToCell: true,
                });
                return (
                    <div
                        key={intersection.start.toISOString()}
                        data-qa={'EventBlockRender-intersection'}
                        className="ControlsLists-timelineGrid__EventBlockRender_intersection"
                        style={intersectionStyle}
                    />
                );
            })}
            {fittingMode && (icon || caption || description) && (
                <span
                    title={title}
                    data-qa={'EventBlockRender-content'}
                    className={
                        'controls-GridReact__cell-baseline ' +
                        `controls-GridReact__cell-baseline_${baseline} ` +
                        'ControlsLists-timelineGrid__EventBlockRender_text ' +
                        `controls-padding_left-${contentLeftMargin} ` +
                        `controls-padding_right-${contentRightMargin} ` +
                        `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                        (props.interactionMode === 'content'
                            ? 'ControlsLists-timelineGrid__EventBlockRender_text_hover'
                            : 'ControlsLists-timelineGrid__EventBlockRender_text_nohover')
                    }
                >
                    {icon && fittingMode ? (
                        <Icon
                            icon={icon}
                            dataQa={icon}
                            iconStyle={iconStyle || fontColorStyle}
                            iconSize={iconSize || 's'}
                            className="js-ControlsLists-timelineGrid__Event_icon ControlsLists-timelineGrid__EventBlockRender_icon"
                        />
                    ) : null}
                    {caption && fittingMode === 'caption' ? caption + ' ' : null}
                    {description && (fittingMode === 'caption' || fittingMode === 'description')
                        ? description
                        : null}
                </span>
            )}
            {props.tagStyle && (
                <TagTemplateReact
                    tagStyle={props.tagStyle}
                    className="ControlsLists-timelineGrid__EventBlockRender_tag"
                    position="topRight"
                    tooltip={props.tagTooltip}
                />
            )}
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
