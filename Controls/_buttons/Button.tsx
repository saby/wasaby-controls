/**
 * @kaizen_zone d8c8fc46-4e44-4724-ab3a-104ce17b50fb
 */
import {
    forwardRef,
    KeyboardEvent,
    LegacyRef,
    MouseEvent,
    RefObject,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { default as ButtonBase } from './ButtonBase';
import { TemplateFunction } from 'UI/Base';
import { IButtonOptions, IViewMode, TextAlign } from './interface/IButton';
import { getIcon, isSVGIcon } from '../Utils/Icon';
import { constants } from 'Env/Env';
import { getFontWidth, loadFontWidthConstants } from 'Controls/Utils/getFontWidth';
import { TFontColorStyle, TFontSize, TIconSize, TIconStyle } from 'Controls/interface';
import { getWasabyContext, useReadonly } from 'UI/Contexts';
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
    _translucent?: string;
}

export function defaultHeight(
    viewMode: string | undefined,
    isCircle: boolean = false
): string | undefined {
    if (isCircle && viewMode !== 'link' && viewMode !== 'linkButton') {
        return 'l';
    }
    if (viewMode === 'filled' || viewMode === 'filled-same' || viewMode === 'outlined') {
        return 'default';
    }
    if (viewMode === 'ghost' || viewMode === 'toolButton' || viewMode === 'pushButton') {
        return 'l';
    }
}

export function defaultFontColorStyle(viewMode: string): string | undefined {
    if (viewMode === 'link' || viewMode === 'linkButton') {
        return 'link';
    }
}

function validateOptions(options: IButtonOptions, context: Record<string, unknown> = {}) {
    const props = { ...options };
    if (props.contrastBackground && props.viewMode === 'outlined') {
        props.viewMode = 'filled';
    }
    if (typeof props.readOnly === 'undefined' && context?.readOnly) {
        props.readOnly = context.readOnly as boolean;
    }
    return props;
}

function getTranslucent(translucent: boolean | string): string {
    if (typeof translucent === 'string') {
        return translucent;
    }
    return translucent ? 'dark' : 'none';
}

export function simpleCssStyleGeneration(
    this: IStateOptions,
    props: IButtonOptions,
    context = {}
): void {
    const options = validateOptions(props, context);
    this._buttonStyle = options.readOnly ? 'readonly' : options.buttonStyle;
    this._contrastBackground =
        options.contrastBackground === undefined
            ? options.viewMode === 'filled'
            : options.contrastBackground;
    this._viewMode = options.viewMode;
    const isCircle = (options.icon || options.iconTemplate) && !options.caption;
    this._height = options.inlineHeight
        ? options.inlineHeight
        : defaultHeight(this._viewMode, isCircle);
    this._translucent = getTranslucent(options.translucent as string);
    this._fontColorStyle = options.fontColorStyle;
    this._fontSize = options.fontSize;
    this._hasIcon = !!options.icon || !!options.iconTemplate;
    if (!['filled', 'filled-same', 'outlined', 'ghost'].includes(this._viewMode as string)) {
        this._textAlign = 'none';
    } else {
        this._textAlign = options.textAlign;
    }

    if (isCircle || (this._viewMode === 'ghost' && !options.textAlign)) {
        this._textAlign = 'center';
    }
    this._caption = options.caption;
    // На сервере rk создает инстанс String'a, проверки на typeof недостаточно
    this._stringCaption = typeof options.caption === 'string' || options.caption instanceof String;
    this._captionPosition = options.captionPosition || 'end';
    this._isSVGIcon = isSVGIcon(options.icon);
    this._icon = getIcon(options.icon);
    if (options.icon || options.iconTemplate) {
        this._iconSize = options.iconSize;
        this._iconStyle = options.readOnly ? 'readonly' : options.iconStyle;
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
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_buttons.less переменные тем оформления}
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
 * @ignoreOptions dataQa
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
function Button(props: IButtonOptions, btnRef: LegacyRef<HTMLElement>) {
    const ref = btnRef || props.forwardedRef;
    const context = useContext(getWasabyContext());
    const readOnly = useReadonly(props);
    const containerRef = useRef<HTMLElement>();
    const captionRef = useRef<HTMLElement>();

    const state = useMemo<IStateOptions>(() => {
        const options: IStateOptions = {
            _hoverIcon: true,
            _isSVGIcon: false,
            _tooltip: props.tooltip,
        };
        simpleCssStyleGeneration.call(options, props, { readOnly });
        return options;
    }, [props, readOnly]);
    const [tooltip, setTooltip] = useState(state._tooltip);
    const [unmounted, setUnmounted] = useState<boolean>(false);
    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            setUnmounted(true);
        };
    }, []);

    useEffect(() => {
        let buttonTooltip = tooltip;
        if (tooltip !== props.tooltip) {
            buttonTooltip = props.tooltip;
        }
        if (state._caption !== props.caption && !props.tooltip) {
            buttonTooltip = '';
        }
        setTooltip(buttonTooltip);
    }, [props.caption, props.tooltip]);

    const getReadOnly = (): boolean => {
        return readOnly || props.loading || false;
    };

    const keyUpHandler = (e: KeyboardEvent<HTMLElement>): void => {
        if (e.nativeEvent.keyCode === constants.key.enter && !getReadOnly()) {
            props.onKeyPress?.(e);
        }
    };

    const clickHandler = (e: MouseEvent<HTMLElement>): void => {
        if (getReadOnly()) {
            e.stopPropagation();
        } else {
            props.onClick?.(e);
        }
    };

    const onMouseEnterHandler = (event: MouseEvent<HTMLElement>): void => {
        if (!getReadOnly()) {
            if (
                !tooltip &&
                !state.hasOwnProperty('tooltip') &&
                typeof props.caption === 'string' &&
                tooltip !== props.caption
            ) {
                loadFontWidthConstants().then(() => {
                    if (unmounted) {
                        return;
                    }
                    if (captionRef.current) {
                        if (captionRef.current.clientWidth < captionRef.current.scrollWidth) {
                            setTooltip(props.caption);
                        }
                    } else {
                        const captionWidth = Math.floor(
                            // @ts-ignore
                            getFontWidth(props.caption, state._fontSize || 'm')
                        );
                        if (
                            containerRef.current &&
                            captionWidth > containerRef.current?.clientWidth
                        ) {
                            setTooltip(props.caption);
                        }
                    }
                });
            }
            props.onMouseEnter?.(event);
        }
    };

    const setRefs = (element: HTMLElement): void => {
        if (element) {
            containerRef.current = element;
        }

        // unmount ref тоже нужен.
        if (ref) {
            if (typeof ref === 'function') {
                ref(element);
            } else {
                ref.current = element;
            }
        }
    };

    const getFocusedClass = (workByKeyboard: boolean): string => {
        const highlightedOnFocus = workByKeyboard && !getReadOnly();
        if (highlightedOnFocus) {
            if (props.contrastBackground || state._viewMode !== 'link') {
                return 'controls-focused-item_shadow';
            }
            return 'controls-focused-item_background controls-focused-item_text-decoration';
        }
        return '';
    };

    // через скоуп может прилететь строковая опция style.
    const style = typeof props.style === 'object' ? props.style : undefined;

    let className = '';
    if (context) {
        className += getFocusedClass(!!context.workByKeyboard);
    }
    if (props.className) {
        if (className) {
            className += ' ';
        }
        className += props.className;
    }
    return (
        <ButtonBase
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=aeb87bef-4cfb-4fc0-8398-ba9ed2f45165
            // @ts-ignore
            testName={props.attrs?.test_name}
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=aa1742dc-ffca-4d34-acfb-529a0e88fcba
            name={props.attrs?.name}
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=b79e0480-c8c8-4aef-abae-335b2a3d8088
            id={props.attrs?.id}
            data-qa={props['data-qa']}
            // @ts-ignore
            data-name={props['data-name']}
            // @ts-ignore
            ws-autofocus={props['ws-autofocus']}
            target={props.target}
            style={style}
            tabIndex={props.tabIndex}
            readOnly={props.readOnly}
            _viewMode={state._viewMode}
            _options={props}
            _buttonStyle={
                state._translucent !== 'none' && !getReadOnly()
                    ? 'translucent'
                    : readOnly
                    ? 'readonly'
                    : props.buttonStyle
                    ? props.buttonStyle
                    : props.viewMode === 'link' || props.viewMode === 'linkButton'
                    ? 'link'
                    : 'secondary'
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
            _tooltip={tooltip}
            ref={setRefs}
            captionRef={captionRef as RefObject<HTMLElement>}
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
            onFocus={props.onFocus}
            onDeactivated={props.onDeactivated}
        />
    );
}

const ForwardRefButton = forwardRef(Button);

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
