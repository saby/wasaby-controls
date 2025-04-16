import { controller as localeController } from 'I18n/i18n';

import {
    TFontSize,
    TFontWeight,
    TTextTransform,
    TFontColorStyle,
    TIconStyle,
    TIconSize,
} from 'Controls/interface';

export const GROUP_EXPANDER_SELECTOR = 'js-controls-Tree__row-expander';

function getTextWrapperClassName(
    fontColorStyle?: TFontColorStyle,
    fontSize?: TFontSize,
    fontWeight?: TFontWeight,
    textTransform?: TTextTransform,
    separatorVisibility?: boolean
): string {
    let className = 'controls-ListView__groupContent-text_wrapper';

    if (fontSize) {
        className += ` controls-fontsize-${fontSize}`;
    } else {
        className += ' controls-ListView__groupContent-text_default';
    }

    if (fontColorStyle) {
        className += ` controls-text-${fontColorStyle}`;
    } else {
        className += ' controls-ListView__groupContent-text_color_default';
    }

    if (fontWeight) {
        className += ` controls-fontweight-${fontWeight}`;
    }

    if (textTransform) {
        className +=
            ` controls-ListView__groupContent_textTransform_${textTransform}` +
            ` controls-ListView__groupContent_textTransform_${textTransform}_${fontSize || 's'}`;
    }

    if (separatorVisibility === false) {
        className += ' tw-flex-grow';
    }

    className += ' controls-ListView__groupContent_baseline';
    if (fontSize && fontSize !== 's' && fontSize !== 'xs' && fontSize !== 'inherit') {
        className += ` controls-ListView__groupContent_baseline_${fontSize}`;
    } else {
        className += ' controls-ListView__groupContent_baseline_default';
    }

    return className;
}

function getTextClassName(
    textAlign: string = 'center',
    expanderVisible?: boolean,
    expanderAlign: string = 'left',
    expanded?: boolean,
    iconSize?: TIconSize,
    iconStyle?: TIconStyle,
    fontSize?: TFontSize
): string {
    let className = 'controls-ListView__groupContent-text';
    className += ` controls-ListView__groupContent_${textAlign}`;
    if (expanderVisible !== false) {
        className += ' controls-ListView__groupContent-text-with_expander';
        if (textAlign === 'center') {
            className += ' tw-justify-center';
        } else if (textAlign === 'right') {
            className += ' tw-justify-end';
        }
        if (!fontSize || fontSize === 'default') {
            className += ` controls-ListView__groupExpander_${expanderAlign}-line-height_default`;
        } else {
            className += ` controls-ListView__groupExpander_${expanderAlign}-line-height_${fontSize}`;
        }
        if (!expanded) {
            className += ' controls-ListView__groupExpander_collapsed';
            className += ` controls-ListView__groupExpander_collapsed_${expanderAlign}`;

            const directionality = localeController.currentLocaleConfig.directionality;
            if (directionality === 'rtl') {
                className += ' controls-ListView__groupExpander_reverse';
            }
        }

        className +=
            ' controls-ListView__groupExpander ' +
            ` controls-ListView__groupExpander_${expanderAlign}` +
            ` controls-ListView__groupExpander-iconSize_${iconSize || 'default'}` +
            ` controls-ListView__groupExpander-iconStyle_${iconStyle || 'default'}` +
            ` ${GROUP_EXPANDER_SELECTOR}`;
    }

    return className;
}

export { getTextClassName, getTextWrapperClassName };
