/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { IControlProps, TFontColorStyle, TFontSize, TIconSize, TIconStyle, } from 'Controls/interface';
import { IViewMode, TextAlign } from './interface/IButton';
import { TInternalProps } from 'UICore/Executor';
import { useReadonly } from 'UI/Contexts';
import { default as BasicButton } from './BasicButton';
import { constants } from 'Env/Env';
import { getTextFontSizeClass } from 'Controls/Utils/getFontClass';

interface IBaseButtonOptions extends IControlOptions, TInternalProps, IControlProps {
    _iconStyle?: TIconStyle;
    _viewMode?: IViewMode;
    _height?: string;
    _loadingIndicator?: React.Component | React.FunctionComponent | TemplateFunction;
    _loading?: boolean;
    _iconTemplate?: React.Component | React.FunctionComponent | TemplateFunction;
    _iconOptions?: unknown;
    _iconSize?: TIconSize;
    _isSVGIcon?: boolean;
    _icon?: string;
    _hasIcon?: boolean;
    _textAlign?: TextAlign;
    _captionPosition?: 'start' | 'end';
    _caption?: React.Component | React.FunctionComponent | TemplateFunction | string | String;
    _stringCaption?: boolean;
    _contrastBackground?: boolean;
    _underlineVisible?: boolean;
    _options?: {
        loading?: boolean;
        href?: string;
        readOnly?: boolean;
        tooltip?: string;
    };
    _tooltip?: string;
    _translucent?: 'none' | 'dark' | 'light';
    _hoverIcon?: boolean;
    _toggled?: boolean;
    _fontSize?: TFontSize;
    _buttonStyle?: string;
    _fontColorStyle?: TFontColorStyle;
    className?: string;
    tabIndex?: number;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
    onClick?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onTouchStart?: (event: React.SyntheticEvent<HTMLElement, React.TouchEvent>) => void;
    onMouseDown?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseEnter?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseOver?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseMove?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onMouseLeave?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    onKeyPress?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
    onKeyDown?: (event: React.SyntheticEvent<HTMLElement, React.KeyboardEvent>) => void;
    onFocus?: (event: React.SyntheticEvent<HTMLElement, React.MouseEvent>) => void;
    captionRef?: React.RefObject<HTMLElement>;
}

function isTranslucentStyle(translucent: string): boolean {
    return !(!translucent || translucent === 'none');
}

function getLoadingTemplate(props: IBaseButtonOptions): React.ReactElement {
    if (props._loading) {
        const loadingClass = `controls-icon_size-${props._iconSize || 's'}`;

        if (props._loadingIndicator) {
            return (
                <span className="controls-BaseButton__loadingIndicator-wrapper">
                    <props._loadingIndicator
                        className={`${
                            props._iconStyle ? 'controls-icon_style-' + props._iconStyle : ''
                        } ${loadingClass}`}
                    />
                </span>
            );
        }
        return (
            <span className="controls-BaseButton__loadingIndicator-wrapper">
                <span
                    className={
                        'controls-BaseButton__icon' +
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
                    }` + ` controls-icon_style-${props._iconStyle || ''}${className}`
                }
                tabIndex={null}
            />
        );
    } else if (!!props._icon) {
        let iconClass =
            'controls-BaseButton__icon' +
            `${props._iconSize ? ' controls-icon_size-' + props._iconSize : ''}` +
            className;
        if (props._isSVGIcon) {
            iconClass += ' controls-icon_svg ';
            return (
                <svg fillRule="evenodd" className={iconClass} tabIndex={props._caption ? -1 : 0}>
                    <use xlinkHref={props._icon} />
                </svg>
            );
        } else {
            iconClass += ` controls-icon ${props._icon}`;
            return <i className={iconClass} tabIndex={props._caption ? -1 : 0} />;
        }
    }
    return null;
}

function getButtonTemplatePadding(props: IBaseButtonOptions): string {
    if (
        props._height &&
        ((['filled', 'filled-same', 'outlined', 'squared'].includes(props._viewMode) && props._caption) ||
            (props._viewMode === 'ghost' && props._caption && props._stringCaption))
    ) {
        return ' controls-button_padding';
    }
    return '';
}

function isCircleButton(props: IBaseButtonOptions): boolean {
    return (
        (!props._caption && ['filled', 'filled-same', 'outlined', 'squared'].includes(props._viewMode)) ||
        (props._viewMode === 'ghost' && !(props._caption && props._stringCaption))
    );
}

function getButtonTemplate(props: IBaseButtonOptions, readOnly: boolean): React.ReactElement {
    const textAlign = props._loading ? 'center' : props._textAlign || 'center';
    let buttonTemplateClass =
        `controls-BaseButton__wrapper controls-Button__wrapper_viewMode-${props._viewMode}` +
        ` controls-BaseButton__wrapper_captionPosition_${props._captionPosition}` +
        ` controls-Button_textAlign-${textAlign}${
            props._height &&
            ((['filled', 'filled-same', 'outlined'].includes(props._viewMode) && props._caption) ||
                (props._viewMode === 'ghost' && props._caption && props._stringCaption)) &&
            props._hasIcon &&
            props._iconSize === 'm' &&
            props._captionPosition === 'end'
                ? ` controls-Button__wrapper_padding-${props._height}_icon-m`
                : ''
        }`;

    if (!isCircleButton(props) && ['filled', 'filled-same', 'outlined'].includes(props._viewMode)) {
        buttonTemplateClass += ' controls-Button__wrapper_mode-button';
    }

    if (props._loading) {
        buttonTemplateClass += ' controls-Button__wrapper_loading';
    }

    let captionClass = 'controls-BaseButton__text';
    if (readOnly) {
        captionClass += ' controls-Button__text_readonly_' + props._viewMode;
    }
    if (props._hasIcon) {
        captionClass += ` controls-button__text_captionPosition_${props._captionPosition}`;
    }
    if (props._loading) {
        captionClass += ' controls-Button__content-hidden';
    }
    captionClass += ` controls-Button__text_viewMode-${props._viewMode}`;
    if (['default', 'm', 'xl', '3xl'].includes(props._fontSize || '')) {
        captionClass += ' ' + getTextFontSizeClass(props._fontSize);
    }

    return (
        <span className={buttonTemplateClass}>
            {getLoadingTemplate(props)}
            {getIconTemplate(props)}
            {!!props._caption ? (
                <span className={captionClass} tabIndex={0} ref={props.captionRef}>
                    {props._stringCaption ? (
                        props._caption
                    ) : props._caption.isWasabyTemplate ||
                      typeof props._caption === 'function' ||
                      typeof props._caption?.render === 'function' ? (
                        <props._caption />
                    ) : (
                        props._caption
                    )}
                </span>
            ) : null}
        </span>
    );
}

function getCircleClass(props: IBaseButtonOptions): string {
    if (isCircleButton(props)) {
        return ' controls-Button_circle';
    }
    return ' controls-Button_notCircle';
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
    ref: React.ForwardedRef<HTMLElement>
): React.ReactElement<IBaseButtonOptions, string> {
    let readOnly = useReadonly(props);
    if (props._options?.readOnly) {
        readOnly = props._options?.readOnly;
    }
    const buttonType =
        props._viewMode === 'link' || props._viewMode === 'linkButton' ? 'linkButton' : 'button';
    let buttonWrapperClass =
        (props._fontColorStyle
            ? ` controls-${buttonType}_fontColorStyle-${props._fontColorStyle}-style`
            : '') +
        `${getButtonTemplatePadding(props)}` +
        ` ${getCircleClass(props)} controls-button_fontsize-${props._fontSize}`;
    if (props._hasIcon) {
        const iconStyle = readOnly ? 'readonly' : props._iconStyle;
        buttonWrapperClass += iconStyle ? ` controls-button_icon-style-${iconStyle}` : '';
        if (
            !readOnly &&
            (props._viewMode === 'link' ||
                props._viewMode === 'linkButton' ||
                props._viewMode === 'ghost')
        ) {
            buttonWrapperClass += ` controls-button_hover_icon-style-${props._iconStyle}`;
        }
    }
    if (props._underlineVisible) {
        buttonWrapperClass += ' controls-text-decoration-underline';
    }
    buttonWrapperClass += ` controls-notFocusOnEnter ${props.className}`;
    const title = props._options?.tooltip || props._tooltip;
    const href = props._options?.href;

    const keyPressHandler = (e: React.SyntheticEvent<HTMLElement, KeyboardEvent>): void => {
        if (e.nativeEvent.keyCode === constants.key.enter && !(readOnly || props._loading)) {
            props.onClick?.(e);
        }
        props.onKeyPress?.(e);
    };
    return (
        <BasicButton
            {...props._options}
            {...props}
            className={buttonWrapperClass}
            ref={ref}
            tooltip={title}
            href={href}
            buttonSize={props._height}
            readOnly={readOnly}
            loading={props._options?.loading}
            onKeyPress={keyPressHandler}
            buttonStyle={
                buttonType === 'linkButton' && !readOnly
                    ? props._fontColorStyle
                    : props._buttonStyle
            }
            toggled={!(isTranslucentStyle(props._translucent) && !readOnly) && props._toggled}
            contrastBackground={props._contrastBackground}
            viewMode={props._viewMode}
            translucent={
                isTranslucentStyle(props._translucent)
                    ? typeof props._translucent === 'boolean'
                        ? 'dark'
                        : props._translucent
                    : undefined
            }
        >
            {getButtonTemplate(props, readOnly)}
        </BasicButton>
    );
});
