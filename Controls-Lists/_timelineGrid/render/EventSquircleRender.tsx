/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { Icon } from 'Controls/icon';
import { getEventFittingMode, TEventInteractionMode, TOverflow } from './EventBlockRender';
import * as React from 'react';
import { TFontSize, THorizontalAlign } from 'Controls/interface';

/**
 * Позиция подвала события в виде скврикла.
 * @typedef {String} Controls-Lists/_timelineGrid/render/EventSquircleRender/TFooterPosition
 * @variant absolute на всю ширину шаблона, поверх контента
 * @variant static на всю ширину шаблона
 */
export type TFooterPosition = 'static' | 'absolute';

/**
 * Интерфейс конфигурации компонента для отрисовки события "Таймлайн таблицы" в виде сквиркла
 * @interface Controls-Lists/_timelineGrid/render/EventSquircleRender/IEventRenderProps
 * @public
 */
export interface IEventRenderProps {
    /**
     * Передаваемые классы
     */
    className?: string;
    /**
     * Иконка события
     */
    icon?: string;
    /**
     * Заголовок события
     */
    caption?: string;
    /**
     * Описание события
     */
    description?: string | JSX.Element;
    /**
     * Размер шрифта текста.
     */
    fontSize?: TFontSize;
    /**
     * Цвет шрифта и иконки.
     */
    fontColorStyle?: string;
    /**
     * Цвет шрифта заголовка.
     */
    captionFontColorStyle?: string;
    /**
     * Цвет шрифта описания.
     */
    descriptionFontColorStyle?: string;
    /**
     * Цвет иконки.
     */
    iconStyle?: string;
    /**
     * Цвет заливки линии
     */
    backgroundColorStyle?: string;
    /**
     * Ширина блока события
     */
    width: number;
    /**
     * Рамка линии снизу
     */
    borderLeftColorStyle?: string;
    /**
     * Рамка линии справа
     */
    borderRightColorStyle?: string;
    /**
     * Режим взаимодействия с событием
     * @default content
     */
    interactionMode?: TEventInteractionMode;
    /**
     * Прикладной контент, выводимый в нижней части шаблона
     */
    footer?: string | JSX.Element;
    /**
     * Варианты расположения контента
     * @cfg {Controls-Lists/_timelineGrid/render/EventSquircleRender/TFooterPosition}
     * @default absolute
     */
    footerPosition?: TFooterPosition;
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
     * Максимальное число строк
     * @cfg {Number}
     */
    maxLines?: number;
    /**
     * Настройка базовой линии для выравивания контента внутри события.
     * @cfg {Controls/interface:TFontSize}
     */
    baseline?: TFontSize;
}

const ICON = 14;
const FONTSIZE = 'm';
const ICONSPACE = 6;
const LEFTSPACE = 8;
const RIGHTSPACE = 8;

export default function EventSquircleRender(props: IEventRenderProps): React.ReactElement {
    const {
        className,
        borderLeftColorStyle,
        borderRightColorStyle,
        backgroundColorStyle,
        caption,
        description,
        icon,
        fontColorStyle = 'default',
        fontSize = FONTSIZE,
        captionFontColorStyle,
        descriptionFontColorStyle,
        iconStyle,
        footer,
        footerPosition,
        width,
        interactionMode,
        maxLines,
        overflow = 'ellipsis',
        align = 'start',
        baseline = 'default',
    } = props;
    const fittingMode = React.useMemo(() => {
        return overflow === 'byWidth' || overflow === 'hidden'
            ? getEventFittingMode(
                  width,
                  icon ? ICON : 0,
                  caption || '',
                  description || '',
                  fontSize,
                  ICONSPACE,
                  LEFTSPACE + RIGHTSPACE
              )
            : 'caption';
    }, [width, icon, caption, description, overflow]);
    const textWidthStyle = React.useMemo(() => {
        if (overflow !== 'visible') {
            return {
                width: `${Math.max(width - LEFTSPACE - RIGHTSPACE, 0)}px`,
            };
        }
    }, [width, overflow]);

    return (
        <div
            className={
                'ControlsLists-timelineGrid__Event ControlsLists-timelineGrid__EventSquircleRender ' +
                `${className} ` +
                `${
                    fittingMode && (caption || description)
                        ? 'ControlsLists-timelineGrid__EventSquircleRender_padding '
                        : ''
                }` +
                `controls-fontsize-${fontSize} controls-text-default ` +
                `tw-justify-${align} ` +
                `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                `ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
                    interactionMode === 'block' ? 'auto' : 'none'
                } `
            }
            data-qa={props.dataQa}
        >
            <div
                data-qa={'EventBlockRender-background'}
                className={
                    'ControlsLists-timelineGrid__EventBlockRender_bg ' +
                    'ControlsLists-timelineGrid__EventBlockRender_bg-left_default ' +
                    'ControlsLists-timelineGrid__EventBlockRender_bg-right_default ' +
                    `${
                        backgroundColorStyle
                            ? `controls-background-${backgroundColorStyle}`
                            : 'controls-background-unaccented'
                    } ` +
                    'ControlsLists-timelineGrid__EventSquircleRender_border-radius ' +
                    `${
                        borderLeftColorStyle
                            ? `ControlsLists-timelineGrid__EventSquircleRender_border_left-color_${borderLeftColorStyle} `
                            : ''
                    }` +
                    `${
                        borderRightColorStyle
                            ? `ControlsLists-timelineGrid__EventSquircleRender_border_right-color_${borderRightColorStyle} `
                            : ''
                    }`
                }
            />
            <span
                style={textWidthStyle}
                data-qa={'EventBlockRender-content'}
                className={
                    'controls-GridReact__cell-baseline ' +
                    `controls-GridReact__cell-baseline_${baseline} ` +
                    `controls-text-${fontColorStyle} ControlsLists-timelineGrid__EventSquircleRender_text ` +
                    'ControlsLists-timelineGrid__EventBlockRender_text ' +
                    `ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
                        interactionMode !== 'content' ? 'none' : 'auto'
                    } ` +
                    (overflow !== 'visible' ? `ws-line-clamp ws-line-clamp_${maxLines} ` : '')
                }
            >
                {icon && fittingMode ? (
                    <Icon
                        icon={icon}
                        iconStyle={iconStyle || fontColorStyle}
                        iconSize={'xs'}
                        className={`${fittingMode !== 'icon' ? ' controls-margin_right-xs' : ''}`}
                    />
                ) : null}
                {caption && fittingMode === 'caption' ? (
                    <span className={`controls-text-${captionFontColorStyle || fontColorStyle}`}>
                        {caption + ' '}
                    </span>
                ) : null}
                {description && (fittingMode === 'caption' || fittingMode === 'description') ? (
                    <span
                        className={`controls-text-${descriptionFontColorStyle || fontColorStyle}`}
                    >
                        {description}
                    </span>
                ) : null}
            </span>
            {footer && fittingMode ? (
                <div
                    className={
                        'ControlsLists-timelineGrid__EventSquircleRender_description ' +
                        `${
                            footerPosition !== 'static'
                                ? 'ControlsLists-timelineGrid__EventSquircleRender_footer-absolute  '
                                : 'tw-w-full '
                        }`
                    }
                >
                    {footer}
                </div>
            ) : null}
        </div>
    );
}

EventSquircleRender.defaultProps = {
    className: '',
    interactionMode: 'content',
};

export const MemoizedEventSquircleRender = React.memo(EventSquircleRender);

/**
 * Компонент для отрисовки события "Таймлайн таблицы" в виде сквиркла.
 * @class Controls-Lists/_timelineGrid/render/EventSquircleRender
 * @implements Controls-Lists/_timelineGrid/render/EventSquircleRender/IEventRenderProps
 * @demo Controls-Lists-demo/timelineGrid/EventRender/WI/EventSquircleRender
 * @public
 */
