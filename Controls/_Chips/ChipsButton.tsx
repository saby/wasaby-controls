/**
 * @kaizen_zone 2ef52292-ab33-4291-af7c-c7368f992ce2
 */
import * as React from 'react';
import {
    IContrastBackgroundOptions,
    IControlProps,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IHeightOptions,
    IIconOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    ITooltipOptions,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Icon } from 'Controls/icon';
import { getTextFontSizeClass } from 'Controls/Utils/getFontClass';
import 'css!Controls/buttons';
import 'css!Controls/Chips';
import 'css!Controls/CommonClasses';

export interface IChipsButtonProps
    extends IHeightOptions,
        ITooltipOptions,
        IIconOptions,
        IIconSizeOptions,
        IIconStyleOptions,
        IFontSizeOptions,
        IFontColorStyleOptions,
        IContrastBackgroundOptions,
        IControlProps,
        TInternalProps {
    iconTemplate?: React.FC<Record<string, unknown>>;
    iconOptions?: object;
    selectedStyle?: string;
    captionPosition?: string;
    caption?: string;
    captionTemplate?: React.FC<Record<string, unknown>>;
    contentTemplate?: React.FC<Record<string, unknown>> | null;
    value?: boolean;
    viewMode?: 'filled' | 'ghost';
    dataQa?: string;

    isCustomCaptionTemplate?: boolean;

    onClick?: Function;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
    onValueChanged?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: boolean) => void;
}

export interface IContentTemplateProps {
    iconTemplate?: React.FC<Record<string, unknown>>;
    icon?: string;
    iconSize?: string;
    iconStyle?: string;
    captionPosition?: string;
    iconOptions?: Object;
    caption?: string;
    captionTemplate?: React.FC<Record<string, unknown>>;
    contrastBackground?: boolean;
    value?: boolean;
    fontSize?: string;
    fontColorStyle?: string;
}

function getIconStyle(props: IChipsButtonProps | IContentTemplateProps): string {
    if (props.value) {
        if (props.contrastBackground) {
            return 'chip_selected-contrast';
        } else {
            return 'chip_selected-same';
        }
    }
    return props.iconStyle || 'default';
}

function captionPosition(props: IChipsButtonProps | IContentTemplateProps): string | undefined {
    if (!props.captionPosition && props.caption) {
        return 'start';
    }
    return props.captionPosition;
}

/**
 * Шаблон для контента кнопки Chips
 * @param props
 */
const ContentTemplate = React.forwardRef(
    (props: IContentTemplateProps, ref: React.LegacyRef<HTMLSpanElement>) => {
        const { iconSize = 's', iconOptions = {}, fontSize = 'm', fontColorStyle } = props;

        return (
            <>
                {props.iconTemplate ? (
                    <props.iconTemplate
                        className={
                            `controls-BaseButton__icon controls-icon controls-icon_size-${iconSize}` +
                            ' tw-self-center'
                        }
                        {...iconOptions}
                    />
                ) : props.icon ? (
                    <Icon
                        className="controls-BaseButton__icon tw-self-center"
                        tabIndex={-1}
                        icon={props.icon}
                        iconSize={iconSize}
                        iconStyle={getIconStyle(props)}
                    />
                ) : null}
                <span
                    ref={ref}
                    className={
                        `controls-BaseButton__text controls-text-${fontColorStyle}` +
                        ` ${
                           (props.icon || props.iconTemplate) && props.caption
                                ? 'controls-button__text_captionPosition_' + captionPosition(props)
                                : ''
                        }`
                    }
                >
                    {props.captionTemplate ? (
                        <props.captionTemplate />
                    ) : (
                        <span
                            className={`controls-ButtonGroup__button-caption controls-fontsize-${fontSize} ${getTextFontSizeClass(
                                fontSize
                            )}`}
                        >
                            {props.caption}
                        </span>
                    )}
                </span>
            </>
        );
    }
);

/**
 * Контрол представляет собой кнопку Chips.
 * @class Controls/Chips:Button
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/interface:IIcon
 * @public
 * @demo Controls-demo/toggle/ChipsButton/Index
 */
export default React.forwardRef(function ChipsButton(
    props: IChipsButtonProps,
    ref: React.ForwardedRef<HTMLSpanElement>
) {
    const {
        inlineHeight = 'm',
        fontSize = 'm',
        viewMode = 'filled',
        fontColorStyle,
        readOnly,
    } = props;

    const isRoundButton = (): boolean => {
        return !(props.caption || props.captionTemplate || props.contentTemplate);
    };

    const getButtonClass = (): string => {
        if (!isRoundButton()) {
            return 'Controls__Chips_withPadding';
        }
        return (
            'Controls__Chips_withoutPadding Controls__Chips_withoutPadding-width_' + inlineHeight
        );
    };

    const getButtonStyle = (): string => {
        const result = [props.value ? 'buttonGroupSelected' : 'buttonGroupUnselected'];
        if (readOnly) {
            result.unshift('readOnly-');
        }
        if (props.contrastBackground) {
            if (viewMode === 'ghost') {
                result.push('-contrast-ghost');
            } else {
                result.push('-contrast');
            }
        } else {
            if (props.selectedStyle === 'contrast' && props.value) {
                result.push('-same-contrast');
            } else {
                if (viewMode === 'ghost') {
                    result.push('-same-ghost');
                } else {
                    result.push('-same');
                }
            }
        }

        return result.join('');
    };

    const getButtonStyleClass = (): string => {
        if (props.selectedStyle && props.value && props.selectedStyle !== 'contrast') {
            if (readOnly) {
                return `controls-background-${props.selectedStyle}-same`;
            }
            return `controls-button_filled-${props.selectedStyle}-style`;
        }

        let textReadOnlyClass = '';
        if (readOnly) {
            if (props.value) {
                textReadOnlyClass = 'controls-button_fontColorStyle-contrast-style';
            } else {
                textReadOnlyClass = 'controls-button_fontColorStyle-readonly-style';
            }
        }

        return `${textReadOnlyClass} controls-Button_buttonGroup_style-${getButtonStyle()}`;
    };

    const onClickHandler = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        props.onClick?.(event);
        props.onValueChanged?.(event, !props.value);
    };

    let shadowSize = 'none';

    if (!readOnly) {
        if (
            (!props.value && props.viewMode !== 'ghost' && props.contrastBackground) ||
            (!props.contrastBackground && props.selectedStyle === 'contrast' && props.value)
        ) {
            shadowSize = ['4xl', '5xl', '6xl', '7xl'].includes(inlineHeight) ? 'big' : 'small';
        }
    }

    let className =
        `controls-BaseButton controls-button_fontColorStyle-${fontColorStyle}-style controls-Button_buttonGroup ${
            !readOnly ? 'controls-Button_clickable' : ''
        }` +
        ` ${getButtonStyleClass()} controls-Button_bg-same controls-inlineheight-${inlineHeight}` +
        ` controls-Button-inlineheight-${inlineHeight} controls-button_size-${inlineHeight} controls-button_padding controls-button_fontsize-${fontSize}` +
        ` controls-button_shadow-${shadowSize}` +
        ` controls-ButtonGroup__button controls-button-style ${
            !props.caption && !props.captionTemplate && !props.contentTemplate
                ? 'controls-Button_circle'
                : 'controls-Button_notCircle'
        } ${getButtonClass()}${
            props.icon || props.iconTemplate
                ? ` controls-button_icon-style-${getIconStyle(props)}`
                : ''
        }${
            !isRoundButton() ? ' controls-Button_notCircle ' : ''
        }`;

    if (props.className) {
        className += ' ' + props.className;
    } else if (props.attrs?.className) {
        className += ' ' + props.attrs.className;
    }

    const attrs = wasabyAttrsToReactDom(props.attrs as Object) || {};

    const contentProps = {
        caption: props.caption,
        captionTemplate: props.captionTemplate,
        icon: props.icon,
        iconTemplate: props.iconTemplate,
        captionPosition: props.captionPosition,
        iconSize: props.iconSize,
        iconOptions: props.iconOptions,
        iconStyle: props.iconStyle,
        value: props.value,
        fontSize,
        fontColorStyle,
        contrastBackground: props.contrastBackground,
    };
    return (
        <span
            data-qa={props.dataQa}
            tabIndex={0}
            {...attrs}
            ref={ref}
            onClick={onClickHandler}
            onMouseEnter={props.onMouseEnter}
            className={className}
            title={props.tooltip}
        >
            <span
                className={
                    'controls-BaseButton__wrapper controls-Button__wrapper_viewMode-buttonGroup' +
                    ` tw-items-${
                        props.isCustomCaptionTemplate ||
                        (props.iconTemplate && !props.caption && !props.captionTemplate)
                            ? 'center'
                            : 'baseline'
                    }` +
                    ` controls-BaseButton__wrapper_captionPosition_${captionPosition(props)}` +
                    ' controls-Button_textAlign-center'
                }
            >
                {props.contentTemplate ? (
                    <props.contentTemplate {...contentProps} />
                ) : (
                    <ContentTemplate {...contentProps} />
                )}
            </span>
        </span>
    );
});

export { ContentTemplate };

/**
 * @name Controls/Chips:Button#selectedStyle
 * @cfg {String} Стиль отображения кнопок в выбранном состоянии.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant contrast
 * @demo Controls-demo/toggle/Chips/SelectedStyle/Index
 */

/**
 * @name Controls/Chips:Button#captionTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон
 */

/**
 * @name Controls/Chips:Button#value
 * @cfg {boolean} Определяет состояние кнопки
 */

/**
 * @name Controls/Chips:Button#viewMode
 * @cfg {String} Определяет внешний вид кнопок.
 * @variant filled Залитые кнопки
 * @variant ghost Фон у кнопки появляется при наведении
 * @default filled
 */
