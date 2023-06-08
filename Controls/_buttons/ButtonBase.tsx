/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import {
    TFontColorStyle,
    TFontSize,
    TIconSize,
    TIconStyle,
    IControlProps,
} from 'Controls/interface';
import { IViewMode, TextAlign } from './interface/IButton';
import { TInternalProps } from 'UICore/Executor';

interface IBaseButtonOptions
    extends IControlOptions,
        TInternalProps,
        IControlProps {
    _iconStyle?: TIconStyle;
    _viewMode?: IViewMode;
    _height?: string;
    _loadingIndicator?:
        | React.Component
        | React.FunctionComponent
        | TemplateFunction;
    _loading?: boolean;
    _iconTemplate?:
        | React.Component
        | React.FunctionComponent
        | TemplateFunction;
    _iconOptions?: unknown;
    _iconSize?: TIconSize;
    _isSVGIcon?: boolean;
    _icon?: string;
    _hasIcon?: boolean;
    _textAlign?: TextAlign;
    _captionPosition?: 'start' | 'end';
    _caption?:
        | React.Component
        | React.FunctionComponent
        | TemplateFunction
        | string
        | String;
    _stringCaption?: boolean;
    _contrastBackground?: boolean;
    _underlineVisible?: boolean;
    _options?: {
        loading?: boolean;
        href?: string;
        readOnly?: boolean;
        tooltip?: string;
        attrs?: Record<string, unknown>;
        $wasabyRef?: Function;
    };
    _tooltip?: string;
    _translucent?: 'none' | 'dark' | 'light';
    _hoverIcon?: boolean;
    _toggled?: boolean;
    _fontSize?: TFontSize;
    _buttonStyle?: string;
    _fontColorStyle?: TFontColorStyle;
    className?: string;
    onClick?: Function;
    onTouchStart?: Function;
    onMouseDown?: Function;
    onMouseEnter?: Function;
    onMouseOver?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    onKeyPress?: Function;
    onKeyDown?: Function;
}

function getShadowSize(height: string): string {
    return height &&
        !['xs', 's', 'm', 'l', 'xl', '2xl', 'default'].includes(height)
        ? 'big'
        : 'small';
}

function isTranslucentStyle(translucent: string): boolean {
    return !(!translucent || translucent === 'none');
}

const getShadowClass = (props: IBaseButtonOptions): string => {
    let shadowClass = ` controls-Button_${props._viewMode}_shadow-`;
    const isPaleShadow = ['pale', 'unaccented'].includes(props._buttonStyle);

    if (
        props._buttonStyle !== 'readonly' &&
        !isPaleShadow &&
        props._contrastBackground &&
        !isTranslucentStyle(props._translucent)
    ) {
        shadowClass += getShadowSize(props._height);
    } else {
        shadowClass += isPaleShadow ? 'pale' : 'none';
    }

    return shadowClass;
};

function getLoadingTemplate(props: IBaseButtonOptions): React.ReactElement {
    if (props._loading) {
        const loadingClass = `controls-icon_size-${props._iconSize || 's'}`;

        if (props._loadingIndicator) {
            return (
                <span className="controls-BaseButton__loadingIndicator-wrapper">
                    <props._loadingIndicator
                        className={`${
                            props._iconStyle
                                ? 'controls-icon_style-' + props._iconStyle
                                : ''
                        } ${loadingClass}`}
                    />
                </span>
            );
        }
        return (
            <span className="controls-BaseButton__loadingIndicator-wrapper">
                <span
                    className={
                        'controls-Button__icon controls-BaseButton__icon' +
                        ' controls-icon controls-BaseButton__loadingIndicator ' +
                        loadingClass
                    }
                    tabIndex={0}
                />
            </span>
        );
    }
    return null;
}

function getIconTemplate(props: IBaseButtonOptions): React.ReactElement {
    const className = props._loading ? ' controls-Button__content-hidden' : '';
    if (props._iconTemplate) {
        return (
            <props._iconTemplate
                {...props._iconOptions}
                className={
                    `controls-BaseButton__icon controls-icon controls-icon_size-${
                        props._iconSize || 's'
                    }` +
                    ` controls-icon_style-${props._iconStyle || ''}${className}`
                }
                tabIndex={null}
            />
        );
    } else if (!!props._icon) {
        let iconClass =
            'controls-Button__icon controls-BaseButton__icon' +
            `${
                props._iconSize ? ' controls-icon_size-' + props._iconSize : ''
            }` +
            `${
                props._iconStyle
                    ? ' controls-icon_style-' + props._iconStyle
                    : ''
            }` +
            className;
        if (props._isSVGIcon) {
            iconClass += ' controls-icon_svg ';
            return (
                <svg
                    fillRule="evenodd"
                    className={iconClass}
                    tabIndex={props._caption ? -1 : 0}
                >
                    <use xlinkHref={props._icon} />
                </svg>
            );
        } else {
            iconClass += ` controls-icon ${props._icon}`;
            if (
                props._textAlign === 'left' &&
                props._captionPosition === 'start'
            ) {
                iconClass += ' controls-Button__icon_position-end';
            }
            return (
                <i className={iconClass} tabIndex={props._caption ? -1 : 0} />
            );
        }
    }
    return null;
}

function getButtonTemplatePadding(props: IBaseButtonOptions): string {
    if (
        props._height &&
        ((['filled', 'outlined'].includes(props._viewMode) && props._caption) ||
            (props._viewMode === 'ghost' &&
                props._caption &&
                props._stringCaption))
    ) {
        return ` controls-Button__wrapper_padding-${props._height}`;
    }
    return '';
}

function isCircleButton(props: IBaseButtonOptions): boolean {
    return (
        (!props._caption && ['filled', 'outlined'].includes(props._viewMode)) ||
        (props._viewMode === 'ghost' &&
            !(props._caption && props._stringCaption))
    );
}

function getButtonTemplate(
    props: IBaseButtonOptions,
    readOnly: boolean
): React.ReactElement {
    const textAlign = props._loading ? 'center' : props._textAlign || 'center';
    let buttonTemplateClass =
        `controls-BaseButton__wrapper controls-Button__wrapper_viewMode-${props._viewMode}` +
        ` controls-BaseButton__wrapper_captionPosition_${props._captionPosition}` +
        ` controls-Button_textAlign-${textAlign}` +
        `${getButtonTemplatePadding(props)}`;

    if (
        !isCircleButton(props) &&
        ['filled', 'outlined'].includes(props._viewMode)
    ) {
        buttonTemplateClass += ' controls-Button__wrapper_mode-button';
    }

    if (props._loading) {
        buttonTemplateClass += ' controls-Button__wrapper_loading';
    }

    if (props._height) {
        if (
            (props._viewMode === 'filled' || props._viewMode === 'outlined') &&
            props._caption
        ) {
            buttonTemplateClass +=
                ' controls-Button__wrapper_inline-height_' + props._height;
        } else {
            buttonTemplateClass +=
                ' controls-Button__wrapper_' +
                props._viewMode +
                '_' +
                props._height;
        }
    }

    let captionClass = 'controls-BaseButton__text';
    if (readOnly) {
        captionClass += ' controls-Button__text_readonly_' + props._viewMode;
    } else if (props._fontColorStyle) {
        captionClass += ` controls-text-${props._fontColorStyle}`;
        captionClass += ` controls-Button__text-${props._fontColorStyle}_viewMode-${props._viewMode}`;
    } else {
        captionClass +=
            ' controls-Button__text_clickable_bg' +
            (props._contrastBackground ? '-contrast' : '-same');
    }
    if (props._underlineVisible) {
        captionClass += ' controls-text-decoration-underline';
    }
    if (props._hasIcon) {
        const height = props._height || 'default';
        captionClass += ` controls-Button__text_captionPosition-${height}_${props._captionPosition}`;
    }
    if (props._loading) {
        captionClass += ' controls-Button__content-hidden';
    }
    captionClass += ` controls-Button__text_viewMode-${props._viewMode}`;

    return (
        <span className={buttonTemplateClass}>
            {getLoadingTemplate(props)}
            {getIconTemplate(props)}
            {!!props._caption ? (
                <span className={captionClass} tabIndex={0}>
                    {props._stringCaption ? props._caption : <props._caption />}
                </span>
            ) : null}
        </span>
    );
}

function getCircleClass(props: IBaseButtonOptions): string {
    if (isCircleButton(props)) {
        return ` controls-Button_circle_height-${props._height}`;
    }
    return '';
}

/**
 * Базовый шаблон кнопки
 *
 * @class Controls/_buttons/ButtonBase
 * @implements Controls/interface:IControl
 * @public
 *
 */
export default React.forwardRef(function ButtonBase(
    props: IBaseButtonOptions,
    _
): React.ReactElement<IBaseButtonOptions, string> {
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
    };
    let readOnly = props.readOnly;
    if (props._options) {
        readOnly = props._options.readOnly;
    }

    const buttonMode = ['filled', 'ghost', 'outlined'].includes(props._viewMode)
        ? 'button'
        : props._viewMode;

    let buttonWrapperClass =
        `controls-BaseButton controls-Button_${props._viewMode}` +
        ` controls-Button_radius-${props._viewMode}` +
        `${props._hoverIcon ? ' controls-Button_hoverIcon' : ''}` +
        ` controls-Button_${
            readOnly || props._options?.loading ? 'readonly' : 'clickable'
        }` +
        `${props._toggled ? ' controls-Button_toggled' : ''}` +
        ` controls-Button_${props._viewMode}_style-${props._buttonStyle}${
            props._toggled ? '_toggled' : ''
        }` +
        ` controls-Button_bg-${
            props._contrastBackground ? 'contrast' : 'same'
        }` +
        `${getCircleClass(props)}` +
        ` controls-fontsize-${props._fontSize}` +
        ` controls-Button_${buttonMode}__wrapper-fontsize-${props._fontSize}` +
        `${getShadowClass(props)} ${getAttrClass()}`;
    if (props._height) {
        buttonWrapperClass +=
            ` controls-inlineheight-${props._height} controls-Button-inlineheight-${props._height}` +
            ` controls-Button_${props._viewMode}_${props._height}`;
    }
    if (isTranslucentStyle(props._translucent)) {
        const translucentStyle =
            typeof props._translucent === 'boolean'
                ? 'dark'
                : props._translucent;
        buttonWrapperClass +=
            ' controls-Button_style-translucent' +
            ` controls-Button_mode-${
                props._viewMode === 'ghost' ? 'ghost' : 'button'
            }_style-translucent-${translucentStyle}` +
            ` controls-Button_style-translucent-${translucentStyle}`;
    }

    const title = props._options?.tooltip || props._tooltip;
    const attrs =
        wasabyAttrsToReactDom(props.attrs || props._options?.attrs) || {};
    const wasabyRef = props.$wasabyRef || props._options?.$wasabyRef;
    return props._options?.href ? (
        <a
            {...attrs}
            href={props._options?.href}
            className={buttonWrapperClass}
            ref={wasabyRef}
            title={title}
            onClick={props.onClick}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onKeyPress={props.onKeyPress}
            onKeyDown={props.onKeyDown}
        >
            {getButtonTemplate(props, readOnly)}
        </a>
    ) : (
        <span
            {...attrs}
            ref={wasabyRef}
            className={buttonWrapperClass}
            title={title}
            onClick={props.onClick}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onKeyPress={props.onKeyPress}
            onKeyDown={props.onKeyDown}
        >
            {getButtonTemplate(props, readOnly)}
        </span>
    );
});
