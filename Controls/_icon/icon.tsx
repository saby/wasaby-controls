/**
 * @kaizen_zone 14859725-2714-49cc-8601-284977d3ba81
 */
import * as React from 'react';
import { IIconStyleOptions, IIconSizeOptions } from 'Controls/interface';
import { isSVGIcon, getIcon, getClasses } from 'Controls/Utils/Icon';
import { MouseEventHandler } from 'react';
import 'css!Controls/CommonClasses';

/**
 * Интерфейс для опций контрола {@link Controls/icon:Icon}.
 * @interface Controls/_icon/IIconOptions
 * @public
 */

export interface IIconOptions extends IIconStyleOptions, IIconSizeOptions {
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
     * @cfg {string}
     * CSS класс
     */
    className?: string;
    /**
     * Обработчик клика на иконку.
     * @function Controls/_icon/IIconOptions#onClick
     * @public
     * @return {void}
     */
    onClick?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseDown.
     * @function Controls/_icon/IIconOptions#onMouseDown
     * @public
     * @return {void}
     */
    onMouseDown?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseUp.
     * @function Controls/_icon/IIconOptions#onMouseUp
     * @public
     * @return {void}
     */
    onMouseUp?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseMove.
     * @function Controls/_icon/IIconOptions#onMouseMove
     * @public
     * @return {void}
     */
    onMouseMove?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseLeave.
     * @function Controls/_icon/IIconOptions#onMouseLeave
     * @public
     * @return {void}
     */
    onMouseLeave?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события MouseEnter.
     * @function Controls/_icon/IIconOptions#onMouseEnter
     * @public
     * @return {void}
     */
    onMouseEnter?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * Обработчик события TouchStart.
     * @function Controls/_icon/IIconOptions#onTouchStart
     * @public
     * @return {void}
     */
    onTouchStart?: MouseEventHandler<SVGSVGElement | HTMLDivElement>;
    /**
     * @cfg {string}
     * Аттрибут для автотестирования
     */
    dataQa?: string;
    tabIndex?: number;
}

interface IInnerIconProps {
    icon: string;
    iconClasses: string;
    tabIndex?: number;
    attrs: Record<string, unknown>;
    forwardedRef?: React.LegacyRef<HTMLDivElement | SVGSVGElement>;
    eventHandlers: {
        onClick: IIconOptions['onClick'];
        onMouseDown: IIconOptions['onMouseDown'];
        onMouseUp: IIconOptions['onMouseUp'];
        onMouseMove: IIconOptions['onMouseMove'];
        onMouseLeave: IIconOptions['onMouseLeave'];
        onTouchStart: IIconOptions['onTouchStart'];
    };
}

function FontIcon(props: IInnerIconProps): JSX.Element {
    return (
        <div
            tabIndex={props.tabIndex}
            {...props.eventHandlers}
            {...props.attrs}
            ref={props.forwardedRef as React.LegacyRef<HTMLDivElement>}
            className={props.iconClasses}
        ></div>
    );
}

function SVGIcon(props: IInnerIconProps): JSX.Element {
    return (
        <svg
            tabIndex={props.tabIndex}
            {...props.eventHandlers}
            {...props.attrs}
            data-qa={props.attrs['data-qa']}
            ref={props.forwardedRef as React.LegacyRef<SVGSVGElement>}
            className={props.iconClasses}
            fillRule="evenodd"
        >
            {props.attrs.title ? <title>{props.attrs.title}</title> : null}
            <use xlinkHref={props.icon} />
        </svg>
    );
}

function IconTemplate(
    props: IIconOptions,
    ref: React.ForwardedRef<HTMLElement | SVGElement>
): JSX.Element {
    const isSvgIcon = isSVGIcon(props.icon || '');
    const icon = getIcon(props.icon);
    const eventHandlers = {
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
    let iconClasses = getClasses(props.iconSize, props.iconStyle, isSvgIcon, icon);
    const attrs = props.attrs || {};
    const className = props.className || attrs.className;
    iconClasses = iconClasses + ' ' + className;
    if (!attrs.title) {
        attrs.title = props.tooltip;
    }
    attrs['data-qa'] = attrs['data-qa'] || props.dataQa;
    const innerProps = {
        icon,
        iconClasses,
        eventHandlers,
        attrs,
        forwardedRef: ref,
    };
    return isSvgIcon ? SVGIcon(innerProps) : FontIcon(innerProps);
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
