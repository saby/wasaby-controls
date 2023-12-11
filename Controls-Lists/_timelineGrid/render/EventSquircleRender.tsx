import { Icon } from 'Controls/icon';
import { IEventRenderProps as IEventBlockRenderProps, getFittingMode } from './EventBlockRender';
import { IEventRenderProps as IEventLineRenderProps } from './EventLineRender';
import * as React from 'react';

/**
 * Интерфейс сквиркла
 */
export interface IEventSquircleProps
    extends Pick<
        IEventBlockRenderProps & IEventLineRenderProps,
        | 'className'
        | 'icon'
        | 'caption'
        | 'description'
        | 'fontColorStyle'
        | 'backgroundColorStyle'
        | 'width'
        | 'borderRightColorStyle'
        | 'borderLeftColorStyle'
    > {
    /**
     * Прикладной контент, выводимый в нижней части шаблона
     */
    footer?: string | JSX.Element;
    /**
     * Варианты расположения контента
     * @variant {String} absolute на всю ширину шаблона, поверх контента
     * @variant {String} static на всю ширину шаблона
     * @default absolute
     */
    footerPosition?: TFooterPosition;
}

export type TFooterPosition = 'static' | 'absolute';

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
 * Шаблон отображения событий - сквиркл
 * @param props
 * @constructor
 */
export default function EventRender(props: IEventSquircleProps) {
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
                'ControlsLists-timelineGrid__EventBlockRender_overflow-ellipsis '
            }
        >
            <span
                className={`controls-text-${fontColorStyle} ControlsLists-timelineGrid__EventSquircleRender_text `}
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
