import * as React from 'react';
import {
    IContrastBackgroundOptions,
    IFontSizeOptions,
    IHeightOptions,
    IControlProps,
    IIconOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    ITooltipOptions,
    IFontColorStyleOptions,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Icon } from 'Controls/icon';
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
    iconTemplate?: React.ReactElement | Function;
    iconOptions?: object;
    selectedStyle?: string;
    captionPosition?: string;
    caption?: string;
    captionTemplate?: React.ReactElement | Function;
    value?: boolean;
    viewMode?: 'filled' | 'ghost';
    dataQa?: string;

    onClick?: Function;
    onMouseEnter?: React.MouseEventHandler;
    onValueChanged?: Function;
}

/**
 * Контрол представляет собой кнопку чипс.
 * @class Controls/Chips:Button
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IContrastBackground
 * @public
 * @demo Controls-demo/toggle/ChipsButton/Index
 */
export default React.forwardRef(function ChipsButton(
    props: IChipsButtonProps,
    ref: React.ForwardedRef<HTMLSpanElement>
) {
    const {
        iconSize = 's',
        iconOptions = {},
        inlineHeight = 'm',
        fontSize = 'm',
        viewMode = 'filled',
        fontColorStyle,
        readOnly,
    } = props;

    const getIconStyle = (): string => {
        if (props.value) {
            if (props.contrastBackground) {
                return 'chip_selected-contrast';
            } else {
                return 'chip_selected-same';
            }
        }
        return props.iconStyle || 'default';
    };

    const captionPosition = (): string => {
        if (!props.captionPosition && props.caption) {
            return 'start';
        }
        return props.captionPosition;
    };

    const isRoundButton = (): boolean => {
        return !(props.caption || props.captionTemplate);
    };

    const getButtonClass = (): string => {
        if (!isRoundButton()) {
            return 'Controls__Chips_withPadding';
        }
        return (
            'Controls__Chips_withoutPadding Controls__Chips_withoutPadding-width_' +
            inlineHeight
        );
    };

    const getButtonStyle = (): string => {
        const result = [
            props.value ? 'buttonGroupSelected' : 'buttonGroupUnselected',
        ];
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
            if (viewMode === 'ghost') {
                result.push('-same-ghost');
            } else {
                result.push('-same');
            }
        }

        return result.join('');
    };

    const getButtonStyleClass = (): string => {
        if (props.selectedStyle && props.value) {
            if (readOnly) {
                return `controls-background-${props.selectedStyle}-same`;
            }
            return `controls-Button_filled_style-${props.selectedStyle}`;
        }

        let textReadOnlyClass = '';
        if (readOnly) {
            if (props.value) {
                textReadOnlyClass = 'controls-text-contrast';
            } else {
                textReadOnlyClass = 'controls-text-readonly';
            }
        }

        return `${textReadOnlyClass} controls-Button_buttonGroup_style-${getButtonStyle()}`;
    };

    const onClickHandler = (event): void => {
        props.onClick?.(event);
        props.onValueChanged?.(event, !props.value);
    };

    let className =
        `controls-BaseButton controls-Button_buttonGroup ${
            !readOnly ? 'controls-Button_clickable' : ''
        }` +
        ` ${getButtonStyleClass()} controls-Button_bg-same controls-inlineheight-${inlineHeight}` +
        ` controls-Button-inlineheight-${inlineHeight} controls-fontsize-m controls-ButtonGroup__button ${getButtonClass()}`;
    if (props.className) {
        className += ' ' + props.className;
    }
    if (props.attrs?.className) {
        className += ' ' + props.attrs.className;
    }

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
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
                    ` controls-BaseButton__wrapper_captionPosition_${captionPosition()}` +
                    ` controls-Button_textAlign-center ${
                        !isRoundButton()
                            ? 'controls-Button__wrapper_padding-' + inlineHeight
                            : ''
                    }`
                }
            >
                {props.iconTemplate ? (
                    <props.iconTemplate
                        className={
                            `controls-BaseButton__icon controls-icon controls-icon_size-${iconSize}` +
                            ` controls-icon_style-${getIconStyle()}`
                        }
                        {...iconOptions}
                    />
                ) : props.icon ? (
                    <Icon
                        className="controls-Button__icon controls-BaseButton__icon"
                        tabIndex={-1}
                        icon={props.icon}
                        iconSize={iconSize}
                        iconStyle={getIconStyle()}
                    />
                ) : null}
                <span
                    className={
                        `controls-BaseButton__text controls-text-${fontColorStyle}` +
                        ` controls-Button__text-default_viewMode-buttonGroup ${
                            props.icon || props.iconTemplate
                                ? 'controls-Button__text_captionPosition-' +
                                  inlineHeight +
                                  '_' +
                                  captionPosition()
                                : ''
                        } controls-Button__text_viewMode-buttonGroup`
                    }
                >
                    {props.captionTemplate ? (
                        <props.captionTemplate />
                    ) : (
                        <span
                            className={`controls-ButtonGroup__button-caption controls-fontsize-${fontSize}`}
                        >
                            {props.caption}
                        </span>
                    )}
                </span>
            </span>
        </span>
    );
});

/**
 * @name Controls/Chips:Button#selectedStyle
 * @cfg {String} Стиль отображения кнопок в выбранном состоянии.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
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
