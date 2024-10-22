/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import {
    CSSProperties,
    FocusEvent,
    forwardRef,
    KeyboardEvent,
    LegacyRef,
    MouseEvent,
    SyntheticEvent,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    WheelEventHandler,
} from 'react';
import {
    IBorderStyleOptions,
    IContrastBackgroundOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    IHeightOptions,
    IInputPlaceholderOptions,
    IValidationStatusOptions,
} from 'Controls/interface';
import { IBorderVisibilityOptions, TBorderVisibility } from './interface/IBorderVisibility';
import { TBorderVisibilityArea } from './interface/IBorderVisibilityArea';
import { TInternalProps, wasabyAttrsToReactDom } from 'UICore/Executor';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { getWasabyContext, useReadonly } from 'UI/Contexts';
import { FocusRoot } from 'UI/Focus';
import { detection } from 'Env/Env';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { importer, lazy } from 'UI/Async';
import 'css!Controls/input';
import { ViewModel } from 'Controls/_input/Base/ViewModel';
import { getTextFontSizeClass } from 'Controls/Utils/getFontClass';

const TagTemplate = lazy(() => importer('Controls/Application/TagTemplate/TagTemplateReact'));

type State =
    | 'valid'
    | 'valid-active'
    | 'invalid'
    | 'invalid-active'
    | 'invalidAccent'
    | 'invalidAccent-active'
    | 'readonly'
    | 'readonly-text-multiline'
    | 'readonly-field-multiline'
    | 'success'
    | 'secondary'
    | 'warning';

export const RENDER_JS_SELECTOR = 'js-controls-Render';

export interface IBorder {
    top: boolean;
    bottom: boolean;
}

export interface IRenderOptions
    extends IControlOptions,
        IHeightOptions,
        IBorderVisibilityOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IValidationStatusOptions,
        IInputPlaceholderOptions,
        IBorderStyleOptions,
        IContrastBackgroundOptions {
    readonlyViewMode?: 'text' | 'field';
    'data-qa'?: string;
    'data-name'?: string;
    style?: CSSProperties;
    counterVisibility?: boolean;
    viewModel?: ViewModel;
    /**
     * @name Controls/_input/Render#multiline
     * @cfg {Boolean} Определяет режим рендеринга текстового поля.
     * @remark
     * * false - однострочный режим.
     * * true - многострочный режим.
     */
    multiline?: boolean;
    /**
     * @name Controls/_input/Render#roundBorder
     * @cfg {Boolean} Определяет скругление рамки текстого поля.
     * @remark
     * * false - квадратная рамка.
     * * true - круглая рамка.
     */
    roundBorder?: boolean;

    /**
     * @name Controls/_input/Render#content
     * @cfg {HTMLElement} Шаблон текстового поля
     */
    content?: TemplateFunction;
    /**
     * @name Controls/_input/Render#leftFieldWrapper
     * @cfg {HTMLElement}
     */
    leftFieldWrapper?: TemplateFunction;
    /**
     * @name Controls/_input/Render#rightFieldWrapper
     * @cfg {HTMLElement}
     */
    rightFieldWrapper?: TemplateFunction;
    state?: string;
    border?: IBorder;
    wasActionByUser?: boolean;
    minLines?: number;
    horizontalPadding?: string;

    textAlign?: string;
    autoFocus?: boolean;
    transliterate?: boolean;
    stretcherContentTemplate?: TemplateFunction;
    footerTemplate?: TemplateFunction;
    tagStyle?: string;
    onTagClick?: (event: MouseEvent<HTMLElement>, target: HTMLElement) => void;
    onTagHover?: (event: MouseEvent<HTMLElement>, target: HTMLElement) => void;

    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void;
    onKeyPress?: (event: KeyboardEvent<HTMLDivElement>) => void;
    onInput?: (event: KeyboardEvent<HTMLDivElement>) => void;
    onMouseDown?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
    onMouseMove?: (event: MouseEvent<HTMLDivElement>) => void;
    onDeactivated?: (event?: FocusEvent<HTMLDivElement>) => void;
    onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    onWheel?: WheelEventHandler<HTMLDivElement>;
    onFocusIn?: () => void;
    onFocusOut?: (event: FocusEvent<HTMLDivElement>) => void;
    onValueChanged?: (value: string) => void;
    onInputCompleted?: (value: string) => void;
}

function notSupportFocusWithin(): boolean {
    return detection.isIE || (detection.isWinXP && detection.yandex);
}

function calcState(props: IRenderOptions, contentActive: boolean, readOnly: boolean): State {
    if (readOnly) {
        if (props.multiline) {
            return `readonly-${props.readonlyViewMode || 'text'}-multiline` as State;
        }

        return 'readonly';
    }
    const validationStatus = props.validationStatus ?? 'valid';
    if (props.borderStyle && validationStatus === 'valid') {
        return props.borderStyle;
    }

    if (contentActive && notSupportFocusWithin()) {
        return (validationStatus + '-active') as State;
    }
    return validationStatus;
}

function getState(props: IRenderOptions, state: string, contentActive: boolean, readOnly: boolean) {
    if (state === '') {
        return `${calcState(props, contentActive, readOnly)}`;
    }
    return `${state}-${calcState(props, contentActive, readOnly)}`;
}

function getFontWeight(fontWeight: string, fontSize: string): string {
    if (fontWeight) {
        return fontWeight;
    } else if (fontSize === '3xl') {
        return 'bold';
    }

    return 'default';
}

function getHorizontalPadding(horizontalPadding: string, contrastBackground: boolean): string {
    let padding;
    if (horizontalPadding) {
        padding = horizontalPadding;
    } else if (contrastBackground !== false) {
        padding = 'xs';
    } else {
        padding = 'null';
    }
    return padding;
}

function detectToBorder(
    borderVisibility: TBorderVisibility | TBorderVisibilityArea,
    minLines: number,
    contrastBackground: boolean
): IBorder {
    switch (borderVisibility) {
        case 'hidden':
            return {
                top: false,
                bottom: false,
            };
        case 'bottom':
            return {
                top: false,
                bottom: true,
            };
        default:
            return {
                top: minLines > 1 && !contrastBackground,
                bottom: true,
            };
    }
}

/**
 * Контрол для рендеринга текстового поля.
 *
 * @class Controls/_input/Render
 * @extends UICore/Base:Control
 *
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IBorderStyle
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IValidationStatus
 * @mixes Controls/input:ITag
 * @mixes Controls/input:IBorderVisibility
 * @implements Controls/interface:IContrastBackground
 *
 * @private
 */

/**
 * @name Controls/_input/Render#fontWeight
 * @demo Controls-demo/Input/FontWeight/Index
 * @private
 */

export default forwardRef(function Render(
    props: IRenderOptions & TInternalProps,
    ref: LegacyRef<HTMLElement>
) {
    const {
        borderVisibility = 'partial',
        contrastBackground = true,
        state = '',
        validationStatus = 'valid',
    } = props;

    const tag = useRef();

    const readOnly = useReadonly(props);
    const [contentActive, setContentActive] = useState(false);
    const [renderState, setRenderState] = useState(() => {
        return getState(props, state, contentActive, readOnly);
    });
    const fontWeight = useMemo(() => {
        return getFontWeight(props.fontWeight as string, props.fontSize as string);
    }, [props.fontWeight, props.fontSize]);
    const horizontalPadding = useMemo(() => {
        return getHorizontalPadding(props.horizontalPadding as string, contrastBackground);
    }, [props.contrastBackground, props.horizontalPadding]);
    const border = useMemo(() => {
        return detectToBorder(borderVisibility, props.minLines as number, contrastBackground);
    }, [borderVisibility, props.minLines, contrastBackground]);

    useLayoutEffect(() => {
        setRenderState(getState(props, state, contentActive, readOnly));
    }, [state, contentActive, readOnly, validationStatus, props.multiline]);

    useEffect(() => {
        return () => {
            props.onDeactivated?.();
        };
    }, []);

    const wasabyContext = useContext(getWasabyContext());
    const highlightedOnFocus = useMemo(() => {
        return wasabyContext?.workByKeyboard && !readOnly && validationStatus === 'valid';
    }, [wasabyContext, readOnly, validationStatus]);

    const getBorderClass = (): string => {
        if (borderVisibility !== 'hidden') {
            return (
                (border.top ? 'controls-Render_border-top' : 'controls-Render_border-top-empty') +
                (border.bottom
                    ? ` controls-Render_border-bottom${
                          contrastBackground ? ' controls-Render_border-bottom_contrast' : ''
                      }`
                    : ' controls-Render_border-bottom-empty')
            );
        }
        return '';
    };
    const isFieldZIndex =
        typeof props.placeholder === 'string' || props.placeholder instanceof String;

    const contentFocusin = useCallback(() => {
        setContentActive(true);
        setRenderState(getState(props, state, true, readOnly));
        props.onFocusIn?.();
    }, []);
    const contentFocusout = useCallback((event) => {
        setContentActive(false);
        setRenderState(getState(props, state, false, readOnly));
        props.onFocusOut?.(event);
    }, []);
    const tagClickHandler = useCallback(
        (event: MouseEvent<HTMLElement>): void => {
            props.onTagClick?.(event, tag.current as unknown as HTMLElement);
        },
        [props.onTagClick, tag]
    );
    const tagHoverHandler = useCallback(
        (event: MouseEvent<HTMLElement>): void => {
            props.onTagHover?.(event, tag.current as unknown as HTMLElement);
        },
        [props.onTagHover, tag]
    );
    const onBlurHandler = (event: FocusEvent<HTMLDivElement>) => {
        props.onDeactivated?.(event);
        props.onBlur?.(event);
    };

    const placeholderTemplate = useCallback(
        (placeholderProps) => {
            return (
                <div
                    className={`controls-Render__placeholder${
                        props.multiline ? '' : ' controls-Render__placeholder_overflow'
                    }${placeholderProps.className ? ` ${placeholderProps.className}` : ''}`}
                >
                    {getContent(props.placeholder)}
                </div>
            );
        },
        [props.multiline, props.placeholder]
    );

    const ContentTemplate = props.children || props.content;
    const contentProps = {
        stretcherContentTemplate: props.stretcherContentTemplate,
        horizontalPadding,
        transliterate: props.transliterate,
        highlightedOnFocus,
        onFocusIn: contentFocusin,
        onFocusOut: contentFocusout,
        'data-qa': 'controls-Render__field',
        className:
            `controls-Render__field controls-Render__field_textAlign_${props.textAlign}` +
            `${!props.multiline ? ' ws-ellipsis' : ''}` +
            `${isFieldZIndex ? ' controls-Render__field_zIndex' : ''}` +
            `${
                !props.footerTemplate && props.minLines && props.minLines > 1
                    ? ' controls-Render__fullHeight'
                    : ''
            }`,
        placeholderTemplate: props.placeholder && placeholderTemplate,
        onValueChanged: props.onValueChanged,
        onInputCompleted: props.onInputCompleted,
    };

    const attrs = wasabyAttrsToReactDom(props.attrs as Record<string, unknown>) || {};
    return (
        <FocusRoot
            {...attrs}
            style={(props.style || attrs.style) as CSSProperties}
            data-qa={attrs['data-qa'] || props['data-qa']}
            data-name={props['data-name']}
            autofocus={props.autoFocus}
            as="div"
            className={
                `controls-Render ${RENDER_JS_SELECTOR} ${getBorderClass()}` +
                ` controls-Render_background-${contrastBackground ? 'contrast' : 'same'}` +
                ` controls-Render_textAlign-${props.textAlign}` +
                ` controls-Render${state === '' ? '' : `_${state}`}_borderRadius` +
                ` controls-Render_state-${renderState}` +
                ` ${getTextFontSizeClass(props.fontSize)}` +
                ` controls-fontsize-${props.fontSize}` +
                ` controls-fontweight-${fontWeight}` +
                `${
                    props.fontSize !== 'inherit'
                        ? ' controls-Render-fontsize-' + props.fontSize
                        : ''
                }` +
                ` controls-text-${props.fontColorStyle}` +
                `${highlightedOnFocus ? ' controls-Render-focused-item' : ''}` +
                ` controls-Render_state-${renderState}_${
                    props.wasActionByUser ? 'caretFilled' : 'caretEmpty'
                }` +
                `${
                    props.multiline
                        ? ' controls-Render_multiline'
                        : ' controls-inlineheight-' +
                          props.inlineHeight +
                          ' controls-Render-inlineheight-' +
                          props.inlineHeight
                }` +
                `${
                    props.className
                        ? ` ${props.className}`
                        : attrs.className
                        ? ` ${attrs.className}`
                        : ''
                }`
            }
            ref={ref as any}
            onClick={props.onClick}
            onKeyDown={props.onKeyDown}
            onKeyPress={props.onKeyPress}
            onKeyUp={props.onKeyUp}
            onMouseDown={props.onMouseDown as any}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseMove={props.onMouseMove}
            onFocus={props.onFocus}
            onInput={props.onInput}
            onWheel={props.onWheel}
            onBlur={onBlurHandler}
        >
            <>
                <div
                    className={`controls-Render__wrapper${
                        props.footerTemplate ? ' controls-Render__wrapper_footer' : ''
                    }`}
                >
                    {!props.multiline && (
                        <span className="controls-Render__baseline">&#65279;</span>
                    )}
                    {props.leftFieldWrapper &&
                        getContent(props.leftFieldWrapper, {
                            className: 'controls-Render__beforeField',
                        })}
                    {getContent(ContentTemplate, contentProps)}
                    {props.rightFieldWrapper &&
                        getContent(props.rightFieldWrapper, {
                            inlineHeight: props.inlineHeight,
                            className: 'controls-Render__afterField',
                        })}
                    {props.footerTemplate && getContent(props.footerTemplate)}
                </div>
                {props.tagStyle && (
                    <TagTemplate
                        tagStyle={props.tagStyle}
                        className={`controls-Render_tag_padding-right${
                            horizontalPadding !== 'null' ? '-empty' : ''
                        }`}
                        ref={tag}
                        onClick={tagClickHandler}
                        onMouseEnter={tagHoverHandler}
                    />
                )}
            </>
        </FocusRoot>
    );
});
