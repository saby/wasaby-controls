/**
 * @kaizen_zone 14859725-2714-49cc-8601-284977d3ba81
 */
import * as React from 'react';
import { IIconStyleOptions, IIconSizeOptions, IControlProps } from 'Controls/interface';
import { isSVGIcon, getIconData } from 'Controls/Utils/Icon';
import { FunctionComponent, MouseEventHandler } from 'react';
import 'css!Controls/CommonClasses';
import { constants } from 'Env/Env';
import { getResourceUrl, loadFont, isCompatibleFontMode } from 'RequireJsLoader/conduct';

/**
 * Интерфейс для опций контрола {@link Controls/icon:Icon}.
 * @interface Controls/_icon/IIconOptions
 * @public
 */

export interface IIconOptions extends IIconStyleOptions, IIconSizeOptions, IControlProps {
    /**
     * @cfg {string}
     * Имя иконки. Может быть два варианта
     * 1) icon-someIcon - Если иконка из шрифта
     * 2) %ModuleName%-icons/%packageName%:icon-someIcon - Если SVG Иконка.
     */
    icon: string;
    /**
     * @cfg {string}
     * Текст всплывающей подсказки, отображаемой при наведении указателя мыши на иконку.
     */
    tooltip?: string;
    /**
     * Обработчик клика на иконку.
     * @function Controls/_icon/IIconOptions#onClick
     * @public
     * @return {void}
     */
    onClick?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseDown.
     * @function Controls/_icon/IIconOptions#onMouseDown
     * @public
     * @return {void}
     */
    onMouseDown?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseUp.
     * @function Controls/_icon/IIconOptions#onMouseUp
     * @public
     * @return {void}
     */
    onMouseUp?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseMove.
     * @function Controls/_icon/IIconOptions#onMouseMove
     * @public
     * @return {void}
     */
    onMouseMove?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseLeave.
     * @function Controls/_icon/IIconOptions#onMouseLeave
     * @public
     * @return {void}
     */
    onMouseLeave?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseEnter.
     * @function Controls/_icon/IIconOptions#onMouseEnter
     * @public
     * @return {void}
     */
    onMouseEnter?: MouseEventHandler<SVGElement | HTMLDivElement>;
    /**
     * Обработчик события TouchStart.
     * @function Controls/_icon/IIconOptions#onTouchStart
     * @public
     * @return {void}
     */
    onTouchStart?: MouseEventHandler<SVGElement | HTMLDivElement>;
    tabIndex?: number;
}

type IIconTypeRender = 'SVG' | 'FONT' | 'OLD_FONT';

const FONT_ICON_PREFIX = 'FONT:';

interface IInnerIconProps {
    icon: string;
    tabIndex?: number;
    className?: string;
    title?: string;
    'data-qa'?: string;
    forwardedRef: React.LegacyRef<HTMLDivElement | SVGElement>;
    eventHandlers: {
        onClick?: IIconOptions['onClick'];
        onMouseDown?: IIconOptions['onMouseDown'];
        onMouseUp?: IIconOptions['onMouseUp'];
        onMouseMove?: IIconOptions['onMouseMove'];
        onMouseLeave?: IIconOptions['onMouseLeave'];
        onTouchStart?: IIconOptions['onTouchStart'];
    };
}

function OLD_FONT_ICON_RENDER(props: IInnerIconProps): JSX.Element {
    return (
        <span
            tabIndex={props.tabIndex}
            {...props.eventHandlers}
            data-qa={props['data-qa']}
            title={props.title}
            ref={props.forwardedRef as React.LegacyRef<HTMLDivElement>}
            className={`${props.className} ${props.icon} controls-icon`}
        ></span>
    );
}

function SVG_ICON_RENDER(props: IInnerIconProps): JSX.Element {
    const iconPath = React.useMemo(() => {
        const iconData = getIconData(props.icon);
        const iconUrl = `${constants.resourceRoot}${iconData.iconModule}/${iconData.iconPackage}.svg`;
        const fileUrl = getResourceUrl(iconUrl, undefined, true);
        return `${fileUrl}#${iconData.icon}`;
    }, [props.icon]);

    return (
        <svg
            tabIndex={props.tabIndex}
            {...props.eventHandlers}
            data-qa={props['data-qa']}
            ref={props.forwardedRef as React.LegacyRef<SVGElement>}
            className={`controls-icon_svg ${props.className}`}
            fillRule="evenodd"
        >
            {props.title ? <title>{props.title}</title> : null}
            <use xlinkHref={iconPath} />
        </svg>
    );
}

function FONT_ICON_RENDER(props: IInnerIconProps): JSX.Element {
    const iconData = React.useMemo(() => {
        const iconData = getIconData(props.icon.split(FONT_ICON_PREFIX)[1]);
        const loadPath = `${iconData.iconModule}/${iconData.iconPackage}`;
        const isCompatibleMode = isCompatibleFontMode();
        return {
            ...getIconData(props.icon.split(FONT_ICON_PREFIX)[1]),
            loadPath,
            isCompatibleMode,
        };
    }, [props.icon]);

    const loadedFontRef = React.useRef('');

    if (loadedFontRef.current !== iconData.loadPath) {
        loadFont(iconData.loadPath);
        loadedFontRef.current = iconData.loadPath;
    }

    return (
        <span
            tabIndex={props.tabIndex}
            {...props.eventHandlers}
            data-qa={props['data-qa']}
            title={props.title}
            ref={props.forwardedRef as React.LegacyRef<HTMLSpanElement>}
            className={`${props.className} controls-icon ${
                iconData.isCompatibleMode ? iconData.icon : ''
            } ${iconData.iconPackage}`}
        >
            {!iconData.isCompatibleMode ? iconData.icon : ''}
        </span>
    );
}

const ICON_RENDER_MAP: Record<IIconTypeRender, FunctionComponent<IInnerIconProps>> = {
    SVG: SVG_ICON_RENDER,
    OLD_FONT: OLD_FONT_ICON_RENDER,
    FONT: FONT_ICON_RENDER,
};

function IconTemplate(
    props: IIconOptions,
    ref: React.ForwardedRef<HTMLElement | SVGElement>
): JSX.Element {
    const iconRenderType = React.useMemo<IIconTypeRender>(() => {
        if (props.icon?.startsWith(FONT_ICON_PREFIX)) {
            return 'FONT';
        } else {
            return isSVGIcon(props.icon) ? 'SVG' : 'OLD_FONT';
        }
    }, [props.icon]);
    const IconRender = ICON_RENDER_MAP[iconRenderType];

    const eventHandlers: Record<
        string,
        MouseEventHandler<HTMLDivElement | SVGElement>
    > = React.useMemo(() => {
        return {
            onClick: (event): void => {
                props.onClick?.(event);
            },
            onMouseDown: (event): void => {
                props.onMouseDown?.(event);
            },
            onMouseUp: (event): void => {
                props.onMouseUp?.(event);
            },
            onMouseLeave: (event): void => {
                props.onMouseLeave?.(event);
            },
            onMouseMove: (event): void => {
                props.onMouseMove?.(event);
            },
            onTouchStart: (event): void => {
                props.onTouchStart?.(event);
            },
        };
    }, [
        props.onClick,
        props.onMouseDown,
        props.onMouseUp,
        props.onMouseLeave,
        props.onMouseMove,
        props.onTouchStart,
    ]);
    const attrs = props.attrs || {};
    const iconClasses = `${props.iconSize ? 'controls-icon_size-' + props.iconSize : ''} ${
        props.iconStyle ? 'controls-icon_style-' + props.iconStyle : ''
    } ${attrs.className || props.className || ''}`;

    if (!attrs.title) {
        attrs.title = props.tooltip;
    }
    attrs['data-qa'] = attrs['data-qa'] || props.dataQa;
    return (
        <IconRender
            icon={props.icon}
            attrs={attrs}
            title={attrs.title}
            className={iconClasses}
            data-qa={attrs['data-qa']}
            eventHandlers={eventHandlers}
            forwardedRef={ref}
        />
    );
}

export default React.forwardRef(IconTemplate);

/**
 * Контрол для отображения иконки
 * @class Controls/icon:Icon
 * @implements Controls/_icon/IIconOptions
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 * @public
 */
