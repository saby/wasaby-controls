/**
 * @kaizen_zone f190b937-88fc-41fd-a54f-9a9b84b2b6e4
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { ButtonTemplate, IButtonOptions, IViewMode, simpleCssStyleGeneration, TButtonStyle, } from 'Controls/buttons';
import 'css!Controls/buttons';
import 'css!Controls/ToggleButton';
import 'css!Controls/CommonClasses';
import {
    ICheckableOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IHeightOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    ITooltipOptions,
    TFontColorStyle,
    TFontSize,
    TIconSize,
    TIconStyle,
} from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { TInternalProps, wasabyAttrsToReactDom } from 'UICore/Executor';

export interface IToggleButtonProps
    extends TInternalProps,
        IButtonOptions,
        ICheckableOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IIconSizeOptions,
        IIconStyleOptions,
        IHeightOptions,
        ITooltipOptions {
    icons?: string[];
    captions?: string[];
    className?: string;
    viewMode?: 'button' | 'link' | 'pushButton' | 'ghost' | 'squared';
    iconStyles?: TIconStyle[];
    buttonStyles?: TButtonStyle[];
    fontColorStyles?: TFontColorStyle[];
    icon?: string;
    onValuechanged?: (event: SyntheticEvent<MouseEvent | KeyboardEvent>, value: boolean) => void;
    onValueChanged?: (event: SyntheticEvent<MouseEvent | KeyboardEvent>, value: boolean) => void;
    onTouchStart?: (event: SyntheticEvent) => void;
    onMouseDown?: (event: SyntheticEvent) => void;
    onMouseEnter?: (event: SyntheticEvent) => void;
    onMouseOver?: (event: SyntheticEvent) => void;
    onMouseMove?: (event: SyntheticEvent) => void;
    onMouseLeave?: (event: SyntheticEvent) => void;
    onKeyDown?: (event: SyntheticEvent) => void;
}

interface IToggleButtonState {
    _buttonStyle?: string;
    _fontColorStyle?: TFontColorStyle;
    _fontSize?: TFontSize;
    _contrastBackground?: boolean;
    _hasIcon?: boolean;
    _viewMode?: IViewMode;
    _height?: string;
    _caption?: string | String | TemplateFunction;
    _stringCaption?: boolean;
    _captionPosition?: 'start' | 'end';
    _icon?: string;
    _iconSize?: TIconSize;
    _iconStyle?: TIconStyle;
    _hoverIcon?: boolean;
}

const getDefaultOptions = () => {
    return {
        viewMode: 'link',
        iconStyle: 'secondary',
        contrastBackground: false,
        fontSize: 'm',
        buttonStyle: 'secondary',
    };
};

const calculateState = (newOptions: IToggleButtonProps, self: IToggleButtonState) => {
    const { value, icons, captions, iconSize } = newOptions;
    self._icon = icons ? (!value && icons[1] ? icons[1] : newOptions.icons[0]) : '';
    self._hasIcon = !!self._icon;
    self._caption = captions ? (!value && captions[1] ? captions[1] : captions[0]) : '';
    self._stringCaption = typeof self._caption === 'string' || self._caption instanceof String;
    const clonedOptions = { ...newOptions };
    clonedOptions.icon = self._icon;
    self._iconSize = (self._icon ? iconSize || 'm' : '') as TIconSize;
    calcStyles(newOptions, self);
};

const calcStyles = (newOptions: IToggleButtonProps, self: IToggleButtonState) => {
    const { value, viewMode, readOnly } = newOptions;
    const iconStyles = newOptions.iconStyles || [newOptions.iconStyle];
    const iconStyle = !value && iconStyles[1] ? iconStyles[1] : iconStyles[0];
    self._iconStyle = self._icon ? (readOnly ? 'readonly' : iconStyle) : '';
    const buttonStyles = newOptions.buttonStyles || [newOptions.buttonStyle];
    const buttonStyle =
        self._viewMode === 'ghost'
            ? 'default'
            : !value && buttonStyles[1]
            ? buttonStyles[1]
            : buttonStyles[0];
    self._buttonStyle = (readOnly ? 'readonly' : buttonStyle) || self._buttonStyle;
    const fontColorStyles = newOptions.fontColorStyles || [newOptions.fontColorStyle];
    const fontColorStyle = newOptions.translucent
        ? 'forTranslucent'
        : !value && fontColorStyles[1]
        ? fontColorStyles[1]
        : fontColorStyles[0];
    self._fontColorStyle = (readOnly ? 'readonly' : fontColorStyle) || self._fontColorStyle;
    if (viewMode === 'pushButton' || viewMode === 'ghost') {
        self._hoverIcon = !value;
    } else {
        self._hoverIcon = true;
    }
};

function getState(props) {
    const options: IToggleButtonState = { _hoverIcon: true };
    const defaultOptions = getDefaultOptions();
    simpleCssStyleGeneration.call(options, {
        ...defaultOptions,
        ...props,
    });
    calculateState({ ...defaultOptions, ...props } as IToggleButtonProps, options);
    return options;
}

export default React.forwardRef(function ToggleButton(
    props: IToggleButtonProps,
    forwardRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const state = React.useMemo<IToggleButtonState>(() => {
        return getState(props);
    }, [props]);

    const clickHandler = (event: SyntheticEvent<MouseEvent | KeyboardEvent>): void => {
        if (!props.readOnly) {
            if (props.onValuechanged) {
                props.onValuechanged(event, !props.value);
            }
            if (props.onValueChanged) {
                props.onValueChanged(event, !props.value);
            }
            if (props.onClick) {
                props.onClick(event);
            }
        }
    };

    const getStyle = () => {
        if (state._viewMode === 'squared') {
            let style: string;
            if (props.value) {
                style = 'default';
            } else {
                style = 'secondary';
            }
            return {
                _iconStyle: style,
                _buttonStyle: style,
            };
        }
        return {
            _iconStyle: state._iconStyle,
            _buttonStyle: state._buttonStyle,
        };
    };

    const keyUpHandler = (e: SyntheticEvent<KeyboardEvent>): void => {
        if (e.nativeEvent.keyCode === constants.key.enter && !props.readOnly) {
            clickHandler(e);
        }
    };
    const attrs = wasabyAttrsToReactDom(props.attrs || {});
    const attrsClassName =
        `controls_toggle_theme-${props.theme || 'default'} ` +
        (props.className || attrs.className || '');
    return (
        <ButtonTemplate
            {...attrs}
            {...getStyle()}
            ref={forwardRef}
            data-qa={props['data-qa']}
            _viewMode={state._viewMode}
            _options={props}
            _underlineVisible={props.underlineVisible}
            _contrastBackground={state._contrastBackground}
            _height={state._height}
            _fontSize={state._fontSize}
            _icon={state._icon}
            _iconTemplate={props.iconTemplate}
            _hoverIcon={state._hoverIcon}
            _toggled={props.value}
            _iconSize={state._iconSize}
            _caption={state._caption}
            _fontColorStyle={state._fontColorStyle || props.viewMode === 'link' ? 'link' : undefined}
            _hasIcon={state._hasIcon}
            _stringCaption={state._stringCaption}
            _captionPosition={state._captionPosition}
            className={attrsClassName}
            onClick={clickHandler}
            onKeyPress={keyUpHandler}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onKeyDown={props.onKeyDown}
        />
    );
});
/**
 * Кнопка, которая переключается между двумя состояниями: включено и выключено.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FButtons%2FStandart%2FIndex демо-пример}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 *
 * @class Controls/ToggleButton
 * @implements Controls/buttons:IButton
 * @implements Controls/interface:ICheckable
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 *
 * @demo Controls-demo/toggle/Button/ViewModes/Index
 */

/*
 * Button that switches between two states: on-state and off-state.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FButtons%2FStandart%2FIndex">Demo-example</a>.
 *
 * @class Controls/ToggleButton
 * @implements Controls/buttons:IButton
 * @implements Controls/interface:ICheckable
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @author Мочалов М.А.
 *
 * @demo Controls-demo/toggle/Button/ViewModes/Index
 */

/**
 * Первая иконка отображается, когда переключатель выключен.
 * Вторая иконка отображается, когда переключатель включен.
 * @name Controls/ToggleButton#icons
 * @cfg {String[]}
 * @example
 * Переключатель с одной иконкой:
 * <pre class="brush: html">
 * <Controls.ToggleButton icons="{{['icon-ArrangeList03']}}" iconSize="s"  viewMode="link"/>
 * </pre>
 * Переключатель с двумя иконками:
 * <pre class="brush: html">
 * <Controls.ToggleButton icons="{{['icon-ArrangeList03', 'icon-ArrangeList04']}}" iconStyle="success" iconSize="s"  viewMode="link"/>
 * </pre>
 */

/*
 * First icon displayed when toggle switch is off.
 * Second icon displayed when toggle switch is on.
 * @name Controls/ToggleButton#icons
 * @cfg {Array}
 * @example
 * Toggle button with one icon.
 * <pre>
 *    <Controls.ToggleButton icons="{{['icon-ArrangeList03']}}" viewMode="link"/>
 * </pre>
 * Toggle button with two icons.
 * <pre>
 *    <Controls.ToggleButton icons="{{['icon-ArrangeList03', 'icon-ArrangeList04']}}" iconStyle="success" iconSize="s" viewMode="link"/>
 * </pre>
 */

/**
 * Первый стиль отображается, когда переключатель выключен.
 * Второй стиль отображается, когда переключатель включен.
 * @name Controls/ToggleButton#iconStyles
 * @cfg {Controls/interface:IIconStyle.TIconStyle[]}
 * @see Controls/ToggleButton#iconStyle
 */

/**
 * Первый стиль отображается, когда переключатель выключен.
 * Второй стиль отображается, когда переключатель включен.
 * @name Controls/ToggleButton#buttonStyles
 * @cfg {String[]}
 * @see Controls/ToggleButton#buttonStyle
 */

/**
 * Первый стиль отображается, когда переключатель выключен.
 * Второй стиль отображается, когда переключатель включен.
 * @name Controls/ToggleButton#fontColorStyles
 * @cfg {Controls/interface:IFontColorStyle.TFontColorStyle[]}
 * @demo Controls-demo/toggle/Button/FontColorStyles/Index
 * @see Controls/ToggleButton#fontColorStyle
 */

/**
 * Первый заголовок отображается, когда переключатель в состоянии "включено".
 * Второй заголовок отображается, когда переключатель в состоянии "выключено".
 * @name Controls/ToggleButton#captions
 * @cfg {String[]}
 * @example
 * Переключатель с двумя заголовками:
 * <pre class="brush: html">
 * <Controls.ToggleButton readOnly="{{false}}" onCaption="{{'Change'}}" offCaption="{{'Save'}}" viewMode="link"/>
 * </pre>
 * Переключатель с одним заголовком
 * <pre class="brush: html">
 * <Controls.ToggleButton readOnly="{{false}}" captions="{{['Save']}}" viewMode="link"/>
 * </pre>
 */

/*
 * First caption displayed when toggle switch is off.
 * Second caption displayed when toggle switch is on.
 * @name Controls/ToggleButton#captions
 * @cfg {Array}
 * @example
 * Toggle button with two captions.
 * <pre>
 *    <Controls.ToggleButton readOnly="{{false}}" onCaption="{{'Change'}}" offCaption="{{'Save'}}" viewMode="link"/>
 * </pre>
 * Toggle button with one caption.
 * <pre>
 *    <Controls.ToggleButton readOnly="{{false}}" captions="{{['Save']}}" viewMode="link"/>
 * </pre>
 */

/**
 * @name Controls/ToggleButton#viewMode
 * @cfg {String} Режим отображения кнопки.
 * @variant button В виде обычной кнопки по умолчанию.
 * @variant link В виде гиперссылки.
 * @variant ghost В виде кнопки для панели инструментов.
 * @variant pushButton В виде гиперссылки, которая меняет свой внешний в зажатом состоянии
 * @default link
 * @example
 * Кнопка-переключатель в режиме отображения - 'link'.
 * <pre class="brush: html">
 * <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="primary" viewMode="link" fontSize="3xl"/>
 * </pre>
 * Кнопка-переключатель в режиме отображения - 'ghost'.
 * <pre class="brush: html">
 * <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="danger" viewMode="ghost"/>
 * </pre>
 * Кнопка-переключатель в режиме отображения - 'pushButton'.
 * <pre class="brush: html">
 * <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="primary" viewMode="pushButton"/>
 * </pre>
 */

/*
 * @name Controls/ToggleButton#viewMode
 * @cfg {Enum} Toggle button view mode.
 * @variant link Decorated hyperlink.
 * @variant pushButton Decorated hyperlink transform to toolbar button.
 * @variant ghost Toolbar button.
 * @default link
 * @example
 * Toggle button with 'link' viewMode.
 * <pre>
 *    <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="primary" viewMode="link" fontSize="3xl"/>
 * </pre>
 * Toggle button with 'ghost' viewMode.
 * <pre>
 *    <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="danger" viewMode="ghost"/>
 * </pre>
 * Toggle button with 'pushButton' viewMode.
 * <pre>
 *    <Controls.ToggleButton captions="{{['Send document']}}" buttonStyle="primary" viewMode="pushButton"/>
 * </pre>
 */
