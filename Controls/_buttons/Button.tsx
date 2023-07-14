/**
 * @kaizen_zone d8c8fc46-4e44-4724-ab3a-104ce17b50fb
 */
import * as React from 'react';
import { default as ButtonBase } from './ButtonBase';
import { TemplateFunction } from 'UI/Base';
import { IButtonOptions, TextAlign } from './interface/IButton';
import { IViewMode } from './interface/IViewMode';
import { getIcon, isSVGIcon } from '../Utils/Icon';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { activate } from 'UI/Focus';
import { __notifyFromReact } from 'UI/Events';
import {
    getFontWidth,
    loadFontWidthConstants,
} from 'Controls/Utils/getFontWidth';
import { default as Consumer } from 'Controls/WorkByKeyboard/Consumer';
import {
    TFontColorStyle,
    TFontSize,
    TIconSize,
    TIconStyle
} from 'Controls/interface';
import { getWasabyContext } from 'UI/Contexts';
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

let count = 1;

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
    const props = {...options};
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
class Button extends React.Component<IButtonOptions, IStateOptions> {
    protected _options: IStateOptions;
    state: IStateOptions;
    _containerRef: React.RefObject<HTMLDivElement>;
    private _instId = 'inst_btn_10' + count++;
    private _content: HTMLElement = null;

    constructor(props: IButtonOptions) {
        super(props);
        this._options = {
            _hoverIcon: true,
            _isSVGIcon: false,
            _tooltip: props.tooltip
        };
        simpleCssStyleGeneration.call(this._options, props, this.context);
        this.state = this._options;
        this._containerRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        if (this.context?.readOnly !== this.props.readOnly) {
            simpleCssStyleGeneration.call(this._options, this.props, this.context);
            this.setState({...this._options});
        }
    }

    componentDidUpdate(prevProps: IButtonOptions) {
        if (prevProps !== this.props) {
            simpleCssStyleGeneration.call(this._options, this.props, this.context);
            if (this.state._tooltip !== this.props.tooltip) {
                this._options._tooltip = this.props.tooltip;
            }
            if (this._options._caption !== this.props.caption && !this.props.tooltip) {
                this._options._tooltip = '';
            }
            this.setState({...this._options});
        }
    }

    componentWillUnmount() {
        this.unmountCallback?.();
    }

    protected _getFocusedClass(workByKeyboard): string {
        const highlightedOnFocus =
            (workByKeyboard?.status) && !this._getReadOnly();
        if (highlightedOnFocus) {
            if (this.props.contrastBackground || this.state._viewMode !== 'link') {
                return 'controls-focused-item_shadow ';
            }
            return 'controls-focused-item_background controls-focused-item_text-decoration ';
        }
        return '';
    }

    get _container(): HTMLElement {
        return this._containerRef.current || null;
    }

    getContainer(): HTMLElement {
        if (!this._content) {
            this._content = this._container;
        }
        return this._content;
    }

    activate(): void {
        activate(this._containerRef.current);
    }

    _notify(eventName: string, args: unknown[], param = {}): void {
        __notifyFromReact(this.getContainer(), eventName, args, param?.bubbling || false);
    }

    getInstanceId(): string {
        return this._instId;
    }

    protected _getReadOnly(): boolean {
        return (this.props.readOnly ?? this.context.readOnly) || this.props.loading;
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (
            e.nativeEvent.keyCode === constants.key.enter &&
            !this._getReadOnly()
        ) {
            this.props.onClick?.(e);
            this.props.onKeyPress?.(e);
        }
    }

    protected clickHandler(e: SyntheticEvent<MouseEvent>): void {
        if (this._getReadOnly()) {
            e.stopPropagation();
        } else {
            this.props.onClick?.(e);
        }
    }

    protected onMouseEnterHandler(event: Event): void {
        if (!this._getReadOnly()) {
            if (
                !this._options._tooltip &&
                !this._options.hasOwnProperty('tooltip') &&
                typeof this.props.caption === 'string' &&
                this._options._tooltip !== this.props.caption
            ) {
                loadFontWidthConstants().then(() => {
                    const captionWidth = Math.floor(getFontWidth(
                        this.props.caption,
                        this._options._fontSize || 'm'
                    ));
                    if (captionWidth > this._container?.clientWidth) {
                        this._options._tooltip = this.props.caption;
                        this.setState({...this._options});
                    }
                });
            }
            this.props.onMouseEnter?.(event);
        }
    }

    private _setRefs(element: HTMLElement): void {
        this._containerRef.current = element;
        if (this.props.forwardedRef) {
            this.props.forwardedRef(element);
        }
    }

    render(): React.ReactNode {
        return (
            <Consumer ref={this.props.forwardedRef}>
                {(consumerProps) => {
                    const attrs = this.props.attrs ? wasabyAttrsToReactDom(this.props.attrs) || {} : {};
                    let className = this._getFocusedClass(consumerProps.workByKeyboard) + 'controls-notFocusOnEnter';
                    if (this.props.className) {
                        className += ' ' + this.props.className;
                    } else if (attrs.className) {
                        className += ' ' + attrs.className;
                    }
                    delete attrs.className;
                    return <ButtonBase
                        {...attrs}
                        attrs={this.props.attrs}
                        data-qa={attrs['data-qa'] || this.props['data-qa']}
                        ws-autofocus={attrs['ws-autofocus'] || this.props['ws-autofocus']}
                        readOnly={this.props.readOnly}
                        _viewMode={this.state._viewMode}
                        _options={this.props}
                        _buttonStyle={(this.state._translucent !== 'none' && !this._getReadOnly())
                            ? 'translucent' : this.state._buttonStyle}
                        _contrastBackground={this.state._contrastBackground}
                        _height={this.state._height}
                        _fontSize={this.state._fontSize}
                        _icon={this.state._icon}
                        _iconSize={this.state._iconSize}
                        _hoverIcon={this.state._hoverIcon}
                        _caption={this.state._caption}
                        _fontColorStyle={this.state._fontColorStyle}
                        _hasIcon={this.state._hasIcon}
                        _stringCaption={this.state._stringCaption}
                        _iconStyle={this.state._iconStyle}
                        _iconOptions={this.props.iconOptions}
                        _captionPosition={this.state._captionPosition}
                        _iconTemplate={this.props.iconTemplate}
                        _isSVGIcon={this.state._isSVGIcon}
                        _textAlign={this.state._textAlign}
                        _translucent={this.props.translucent}
                        _loading={this.props.loading}
                        _underlineVisible={this.props.underlineVisible}
                        _loadingIndicator={this.props.loadingIndicator}
                        _tooltip={this.state._tooltip}
                        ref={this._setRefs.bind(this)}
                        className={className}
                        onClick={this.clickHandler.bind(this)}
                        onMouseEnter={this.onMouseEnterHandler.bind(this)}
                        onKeyPress={this._keyUpHandler.bind(this)}
                        onTouchStart={this.props.onTouchStart}
                        onMouseDown={this.props.onMouseDown}
                        onMouseOver={this.props.onMouseOver}
                        onMouseMove={this.props.onMouseMove}
                        onMouseLeave={this.props.onMouseLeave}
                        onKeyDown={this.props.onKeyDown}
                    />;
                }}
            </Consumer>
        );
    }

    static contextType = getWasabyContext();//Context;
    static defaultProps = getDefaultOptions();
}

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

export default Button;
