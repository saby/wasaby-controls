/**
 * @kaizen_zone d8c8fc46-4e44-4724-ab3a-104ce17b50fb
 */
import * as React from 'react';
import { default as ButtonBase } from './ButtonBase';
import { TemplateFunction } from 'UI/Base';
import { IButtonOptions, TextAlign } from './interface/IButton';
import { IViewMode } from './interface/IViewMode';
import { getIcon, isSVGIcon } from '../Utils/Icon';
import { constants } from 'Env/Env';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { getFontWidth, loadFontWidthConstants } from 'Controls/Utils/getFontWidth';
import { TFontColorStyle, TFontSize, TIconSize, TIconStyle } from 'Controls/interface';
import { useReadonly, getWasabyContext } from 'UI/Contexts';
import 'css!Controls/buttons';
import 'css!Controls/CommonClasses';

interface IStateOptions {
    _buttonStyle?: string;
    _fontColorStyle?: TFontColorStyle;
    _fontSize?: TFontSize;
    _contrastBackground?: boolean;
    _hasIcon?: boolean;
    _viewMode?: IViewMode;
    _height?: string;
    _caption?: string | TemplateFunction;
    _stringCaption?: boolean;
    _captionPosition?: 'start' | 'end';
    _icon?: string;
    _iconSize?: TIconSize;
    _iconStyle?: TIconStyle;
    _hoverIcon?: boolean;
    _isSVGIcon?: boolean;
    _textAlign?: TextAlign;
    _tooltip?: string;
    _focusedClass?: string;
}

export function defaultHeight(viewMode: string, isCircle: boolean = false): string {
    if (isCircle && viewMode !== 'link' && viewMode !== 'linkButton') {
        return 'l';
    }
    if (viewMode === 'filled' || viewMode === 'outlined') {
        return 'default';
    }
    if (viewMode === 'ghost' || viewMode === 'toolButton' || viewMode === 'pushButton') {
        return 'l';
    }
}

export function defaultFontColorStyle(viewMode: string): string {
    if (viewMode === 'link' || viewMode === 'linkButton') {
        return 'link';
    }
}

function validateOptions(options: IButtonOptions, context = {}) {
    const props = { ...options };
    if (props.contrastBackground && props.viewMode === 'outlined') {
        props.viewMode = 'filled';
    }
    if (typeof props.readOnly === 'undefined' && context?.readOnly) {
        props.readOnly = context.readOnly;
    }
    return props;
}

function getTranslucent(translucent: boolean | string): string {
    if (typeof translucent === 'string') {
        return translucent;
    }
    return translucent ? 'dark' : 'none';
}

export function simpleCssStyleGeneration(props: IButtonOptions, context = {}): void {
    const options = validateOptions(props, context);
    this._buttonStyle = options.readOnly
        ? 'readonly'
        : options.viewMode === 'ghost'
        ? 'default'
        : options.buttonStyle;
    this._contrastBackground =
        options.contrastBackground === undefined
            ? options.viewMode === 'filled'
            : options.contrastBackground;
    this._viewMode = options.viewMode;
    const isCircle = (options.icon || options.iconTemplate) && !options.caption;
    this._height = options.inlineHeight
        ? options.inlineHeight
        : defaultHeight(this._viewMode, isCircle);
    this._translucent = getTranslucent(options.translucent);
    if (this._translucent !== 'none') {
        this._fontColorStyle = this._translucent === 'dark' ? 'forTranslucent' : 'default';
    } else {
        this._fontColorStyle = options.fontColorStyle
            ? options.fontColorStyle
            : defaultFontColorStyle(this._viewMode);
    }
    this._fontSize = options.fontSize;
    this._hasIcon = !!options.icon || !!options.iconTemplate;
    if (!['filled', 'outlined', 'ghost'].includes(this._viewMode)) {
        this._textAlign = 'none';
    } else {
        this._textAlign = options.textAlign;
    }

    if (isCircle || (this._viewMode === 'ghost' && !options.textAlign)) {
        this._textAlign = 'center';
    }

    if (
        this._buttonStyle === 'unaccented' &&
        this._contrastBackground &&
        (!this._fontColorStyle || this._fontColorStyle === 'contrast')
    ) {
        this._fontColorStyle = 'default';
    }

    this._caption = options.caption;
    // На сервере rk создает инстанс String'a, проверки на typeof недостаточно
    this._stringCaption = typeof options.caption === 'string' || options.caption instanceof String;
    this._captionPosition = options.captionPosition || 'end';
    this._isSVGIcon = isSVGIcon(options.icon);
    this._icon = getIcon(options.icon);
    if (options.icon || options.iconTemplate) {
        this._iconSize = options.iconSize;
        if (options.readOnly) {
            this._iconStyle = 'readonly';
        } else {
            if (this._translucent !== 'none') {
                this._iconStyle = this._translucent === 'dark' ? 'forTranslucent' : 'default';
            } else {
                this._iconStyle = options.iconStyle;
            }
        }
    }

    if (options.color && this._translucent === 'none') {
        switch (this._viewMode) {
            case 'filled':
                this._iconStyle = 'contrast';
                break;
            case 'outlined':
                this._iconStyle = options.color;
                break;
            case 'link':
            case 'linkButton':
                this._fontColorStyle = options.fontColorStyle
                    ? options.fontColorStyle
                    : options.color;
                this._iconStyle = options.color;
                break;
        }
    }

    if (this._viewMode === 'linkButton') {
        this._viewMode = 'link';
        if (!this._height) {
            this._height = 'default';
        }
    }
}

export function getDefaultOptions(): object {
    return {
        viewMode: 'outlined',
        iconStyle: 'secondary',
        iconSize: 'm',
        captionPosition: 'end',
        fontSize: 'm',
        buttonStyle: 'secondary',
        textAlign: 'center',
        translucent: 'none',
    };
}

function getProps(props: IButtonOptions): IButtonOptions {
    const defaultProps = getDefaultOptions();
    Object.keys(defaultProps).forEach((name) => {
        if (typeof props[name] === 'undefined') {
            props[name] = defaultProps[name];
        }
    });
    return props;
}

/**
 * Графический контрол, который предоставляет пользователю возможность простого запуска события при нажатии на него.
 * @class Controls/_buttons/Button
 * @remark
 * Кнопки могут отображаться в нескольких режимах, отличающихся друга от друга внешне.
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FButtons%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/new-buttons/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_buttons.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @mixes Controls/buttons:IButton
 * @mixes Controls/buttons:IClick
 * @mixes Controls/buttons:IViewMode
 * @implements Controls/interface:IHref
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IControl
 *
 * @public
 * @demo Controls-demo/Buttons/ViewModes/Index
 */

/*
 * Graphical control element that provides the user a simple way to trigger an event.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FButtons%2FStandart%2FIndex">Demo-example</a>.
 *
 * @class Controls/_buttons/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:IHref
 * @mixes Controls/buttons:IButton
 * @implements Controls/interface:ICaption
 * @mixes Controls/buttons:IClick
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/Buttons/ViewModes/Index
 */
function Button(options: IButtonOptions, btnRef) {
    const ref = btnRef || options.forwardedRef;
    const props = getProps({ ...(options || {}) });
    const context = React.useContext(getWasabyContext());
    const readOnly = useReadonly(props);
    const containerRef = React.createRef<HTMLElement>();

    const [state, setState] = React.useState<IStateOptions>(() => {
        const _options: IStateOptions = {
            _hoverIcon: true,
            _isSVGIcon: false,
            _tooltip: props.tooltip,
        };
        simpleCssStyleGeneration.call(_options, props, { readOnly });
        return _options;
    });

    React.useLayoutEffect(() => {
        const _options = state;
        simpleCssStyleGeneration.call(_options, props, { readOnly });
        if (state._tooltip !== props.tooltip) {
            _options._tooltip = props.tooltip;
        }
        if (_options._caption !== props.caption && !props.tooltip) {
            _options._tooltip = '';
        }
        setState({ ..._options });
    }, [options]);

    const getReadOnly = (): boolean => {
        return readOnly || props.loading;
    };

    const keyUpHandler = (e: React.SyntheticEvent<HTMLElement, KeyboardEvent>): void => {
        if (e.nativeEvent.keyCode === constants.key.enter && !getReadOnly()) {
            props.onClick?.(e);
            props.onKeyPress?.(e);
        }
    };

    const clickHandler = (e: React.SyntheticEvent<HTMLElement, MouseEvent>): void => {
        if (getReadOnly()) {
            e.stopPropagation();
        } else {
            props.onClick?.(e);
        }
    };

    const onMouseEnterHandler = (event: React.SyntheticEvent<HTMLElement, MouseEvent>): void => {
        if (!getReadOnly()) {
            if (
                !state._tooltip &&
                !state.hasOwnProperty('tooltip') &&
                typeof props.caption === 'string' &&
                state._tooltip !== props.caption
            ) {
                loadFontWidthConstants().then(() => {
                    const captionWidth = Math.floor(
                        getFontWidth(props.caption, state._fontSize || 'm')
                    );
                    if (captionWidth > containerRef.current?.clientWidth) {
                        state._tooltip = props.caption;
                        setState({ ...state });
                    }
                });
            }
            props.onMouseEnter?.(event);
        }
    };

    const setRefs = (element: HTMLElement): void => {
        if (element) {
            containerRef.current = element;
            if (ref) {
                if (typeof ref === 'function') {
                    ref(element);
                } else {
                    ref.current = element;
                }
            }
        }
    };

    const getFocusedClass = (workByKeyboard: boolean): string => {
        const highlightedOnFocus = workByKeyboard && !getReadOnly();
        if (highlightedOnFocus) {
            if (props.contrastBackground || state._viewMode !== 'link') {
                return ' controls-focused-item_shadow';
            }
            return ' controls-focused-item_background controls-focused-item_text-decoration';
        }
        return '';
    };

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    let className = 'controls-notFocusOnEnter';
    if (context) {
        className += getFocusedClass(context.workByKeyboard);
    }
    if (props.className) {
        className += ' ' + props.className;
    } else if (attrs.className) {
        className += ' ' + attrs.className;
    }
    delete attrs.className;
    return (
        <ButtonBase
            {...attrs}
            attrs={props.attrs}
            data-qa={attrs['data-qa'] || props['data-qa']}
            ws-autofocus={attrs['ws-autofocus'] || props['ws-autofocus']}
            readOnly={props.readOnly}
            _viewMode={state._viewMode}
            _options={props}
            _buttonStyle={
                state._translucent !== 'none' && !getReadOnly() ? 'translucent' : state._buttonStyle
            }
            _contrastBackground={state._contrastBackground}
            _height={state._height}
            _fontSize={state._fontSize}
            _icon={state._icon}
            _iconSize={state._iconSize}
            _hoverIcon={state._hoverIcon}
            _caption={state._caption}
            _fontColorStyle={state._fontColorStyle}
            _hasIcon={state._hasIcon}
            _stringCaption={state._stringCaption}
            _iconStyle={state._iconStyle}
            _iconOptions={props.iconOptions}
            _captionPosition={state._captionPosition}
            _iconTemplate={props.iconTemplate}
            _isSVGIcon={state._isSVGIcon}
            _textAlign={state._textAlign}
            _translucent={props.translucent}
            _loading={props.loading}
            _loadingIndicator={props.loadingIndicator}
            _underlineVisible={props.underlineVisible}
            _tooltip={state._tooltip}
            ref={setRefs}
            className={className}
            onClick={clickHandler}
            onMouseEnter={onMouseEnterHandler}
            onKeyPress={keyUpHandler}
            onTouchStart={props.onTouchStart}
            onMouseDown={props.onMouseDown}
            onMouseOver={props.onMouseOver}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onKeyDown={props.onKeyDown}
        />
    );
}

const ForwardRefButton = React.forwardRef(Button);

ForwardRefButton.defaultProps = getDefaultOptions();

export default ForwardRefButton;

/**
 * @name Controls/_buttons/Button#textAlign
 * @cfg {String} Выравнивание текста кнопки.
 * @variant left Текст выравнивается по левой стороне.
 * @variant right Текст выравнивается по правой стороне.
 * @variant center Текст выравнивается по центру.
 * @variant justify Текст и иконка прижаты к разным краям.
 * @default center
 * @demo Controls-demo/Buttons/TextAlign/Index
 */

/**
 * @name Controls/_buttons/Button#fontColorStyle
 * @cfg {Controls/interface/TFontColorStyle.typedef}
 * @demo Controls-demo/Buttons/FontStyles/Index
 */

/**
 * @name Controls/_buttons/Button#href
 * @cfg {String}
 * @demo Controls-demo/Buttons/Href/Index
 */

/**
 * @name Controls/_buttons/Button#iconStyle
 * @cfg {String}
 * @demo Controls-demo/Buttons/IconStyles/Index
 */

/**
 * @name Controls/_buttons/Button#tooltip
 * @cfg {String}
 * @remark Если в кнопку передан длинный текст, который не помещается, а также не указана опция,
 * то значение в tooltip устанавливается автоматически, и равно caption.
 * @demo Controls-demo/Buttons/Tooltip/Index
 */

/**
 * @name Controls/_buttons/Button#translucent
 * @cfg {String}
 * @demo Controls-demo/Buttons/Translucent/Index
 */

/**
 * @name Controls/_buttons/Button#captionPosition
 * @cfg {String} Определяет, с какой стороны расположен текст кнопки относительно иконки.
 * @variant start Текст расположен перед иконкой.
 * @variant end Текст расположен после иконки.
 * @default end
 * @demo Controls-demo/Buttons/CaptionPosition/Index
 */

/*
 * @name Controls/_buttons/Button#captionPosition
 * @cfg {String} Determines on which side of the icon caption is located.
 * @variant left Caption before icon.
 * @variant right Icon before caption.
 * @default right
 */

/**
 * @name Controls/_buttons/Button#fontSize
 * @cfg {String}
 * @demo Controls-demo/Buttons/SizesAndHeights/Index
 * @default m
 * @example
 * <pre class="brush: html">
 * <Controls.buttons:Button icon="icon-Add" fontSize="xl" viewMode="outlined"/>
 * </pre>
 */

/**
 * @name Controls/_buttons/Button#loading
 * @cfg {Boolean} Определяет состояние загрузки. В активном состоянии отобразит ромашку внутри кнопки.
 * @demo Controls-demo/Buttons/LoadingButton/Index
 */

/**
 * @name Controls/_buttons/Button#loadingIndicator
 * @cfg {TemplateFunction} Определяет шаблон, который будет отображаться вместо стандартного состояния загрузки.
 * @see Controls/_buttons/Button#loading
 * @demo Controls-demo/Buttons/LoadingButton/Index
 */
