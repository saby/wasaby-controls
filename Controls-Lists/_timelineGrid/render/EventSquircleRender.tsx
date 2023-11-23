import { Icon } from 'Controls/icon';
import { getFittingMode, TEventInteractionMode } from './EventBlockRender';
import * as React from 'react';
import { TFontSize } from 'Controls/interface';

/**
 * Позиция подвала события в виде скврикла.
 * @typedef Controls-Lists/_timelineGrid/render/EventSquircleRender/TFooterPosition
 * @variant {String} absolute на всю ширину шаблона, поверх контента
 * @variant {String} static на всю ширину шаблона
 */
export type TFooterPosition = 'static' | 'absolute';

/**
 * Интерфейс конфигурации события "Таймлайн таблицы" в виде сквирклаю
 */
export interface IEventSquircleProps {
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
}

const ICON = 14;
const FONTSIZE = 'm';
const ICONSPACE = 6;
const LEFTSPACE = 8;
const RIGHTSPACE = 12;
// Для поддержания отступа между двумя событиями,
// в случае если время конца первого является временем начала второго,
// решили обрезать всегда шаблон сквиркла справа на 3px
const RIGHTOFFSET = 3;

/**
 * Событие "Таймлайн таблицы" в виде сквиркла.
 * @param props Конфигурация компонента.
 * @demo Controls-Lists-demo/timelineGrid/EventRender/WI/EventSquircleRender
 */
function EventSquircleRender(props: IEventSquircleProps): React.ReactElement {
    const {
        className,
        borderLeftColorStyle,
        borderRightColorStyle,
        backgroundColorStyle,
        caption,
        description,
        icon,
        fontColorStyle,
        footer,
        footerPosition,
        width,
        interactionMode,
    } = props;
    const fittingMode = React.useMemo(() => {
        return getFittingMode(
            width - RIGHTOFFSET,
            icon ? ICON : 0,
            caption,
            description,
            FONTSIZE,
            ICONSPACE,
            LEFTSPACE + RIGHTSPACE
        );
    }, [width, icon, caption, description]);
    return (
        <div
            className={
                'ControlsLists-timelineGrid__EventSquircleRender ' +
                `${className} ` +
                'ControlsLists-timelineGrid__EventSquircleRender_padding ' +
                'controls-fontsize-m controls-text-default ' +
                'ControlsLists-timelineGrid__EventBlockRender_overflow-ellipsis ' +
                `ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
                    interactionMode === 'block' ? 'auto' : 'none'
                } `
            }
        >
            <span
                className={
                    `controls-text-${fontColorStyle} ControlsLists-timelineGrid__EventSquircleRender_text ` +
                    `ControlsLists-timelineGrid__EventBlockRender_pointerEvents_${
                        interactionMode !== 'content' ? 'none' : 'auto'
                    } `
                }
            >
                {icon && fittingMode ? (
                    <Icon
                        icon={icon}
                        iconStyle={fontColorStyle}
                        iconSize={'xs'}
                        className="ControlsLists-timelineGrid__EventSquircleRender_icon"
                    />
                ) : null}
                {caption && (fittingMode === 'icon' || fittingMode === 'caption')
                    ? caption + ' '
                    : null}
                {description && fittingMode ? description : null}
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
            <div
                className={
                    'ControlsLists-timelineGrid__EventBlockRender_bg ' +
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
            ></div>
        </div>
    );
}

EventSquircleRender.defaultProps = {
    className: '',
    interactionMode: 'content',
};

export default EventSquircleRender;
