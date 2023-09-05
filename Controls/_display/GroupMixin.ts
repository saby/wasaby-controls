/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import {
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TTextTransform,
    TIconSize,
    TIconStyle,
} from 'Controls/interface';

/**
 * Миксин, который содержит общую логику отображения заголовка группы.
 * @private
 */
export default abstract class GroupMixin {
    /**
     * Добавляет CSS классы для стилизации текста в заголовке группы.
     * @param templateFontColorStyle Цвет шрифта
     * @param templateFontSize Размер шрифта
     * @param templateFontWeight Насыщенность шрифта
     * @param templateTextTransform Преобразование шрифта
     */
    getContentTextStylingClasses(
        templateFontColorStyle?: TFontColorStyle,
        templateFontSize?: TFontSize,
        templateFontWeight?: TFontWeight,
        templateTextTransform?: TTextTransform
    ): string {
        let classes = '';
        if (templateFontSize) {
            classes += ` controls-fontsize-${templateFontSize}`;
        } else {
            classes += ' controls-ListView__groupContent-text_default';
        }
        if (templateFontColorStyle) {
            classes += ` controls-text-${templateFontColorStyle}`;
        } else {
            classes += ' controls-ListView__groupContent-text_color_default';
        }
        if (templateFontWeight) {
            classes += ` controls-fontweight-${templateFontWeight}`;
        }
        if (templateTextTransform) {
            classes +=
                ` controls-ListView__groupContent_textTransform_${templateTextTransform}` +
                ` controls-ListView__groupContent_textTransform_${templateTextTransform}_${
                    templateFontSize || 's'
                }`;
        }
        return classes;
    }

    /**
     * Добавляет CSS классы обёртки текста в заголовке группы
     * Настройки из groupNodeConfig по умолчанию имеют больший приоритет, т.к. это настройки заголовка группы
     * Настройки из конфига колонки в этом случае на втором месте
     * Настройки из шаблона в этом случае имеют самый низкий приолритет, т.к. это настройки Controls/treeGrid:ItemTemplate
     * @param templateFontColorStyle Цвет шрифта
     * @param templateFontSize Размер шрифта
     * @param templateFontWeight Насыщенность шрифта
     * @param templateTextTransform Преобразование шрифта
     * @param separatorVisibility Видимость разделтителя
     */
    getContentTextWrapperClasses(
        templateFontColorStyle?: TFontColorStyle,
        templateFontSize?: TFontSize,
        templateFontWeight?: TFontWeight,
        templateTextTransform?: TTextTransform,
        separatorVisibility?: boolean
    ): string {
        let classes = 'controls-ListView__groupContent-text_wrapper';
        classes += this.getContentTextStylingClasses(
            templateFontColorStyle,
            templateFontSize,
            templateFontWeight,
            templateTextTransform
        );
        if (separatorVisibility === false) {
            classes += ' tw-flex-grow';
        }
        return classes;
    }

    getContentTextClasses(textAlign: 'right' | 'left'): string {
        let classes = 'controls-ListView__groupContent-text';
        classes += ` controls-ListView__groupContent_${textAlign || 'center'}`;
        return classes;
    }

    getExpanderClasses(
        expanderVisible: boolean = true,
        expanderAlign: 'right' | 'left' = 'left',
        iconSize: TIconSize,
        iconStyle: TIconStyle
    ): string {
        let classes = '';
        if (expanderVisible !== false) {
            if (!this.isExpanded()) {
                classes += ' controls-ListView__groupExpander_collapsed';
                classes += ` controls-ListView__groupExpander_collapsed_${expanderAlign}`;

                if (this.getDirectionality() === 'rtl') {
                    classes += ' controls-ListView__groupExpander_reverse';
                }
            }

            classes +=
                ' controls-ListView__groupExpander ' +
                ` controls-ListView__groupExpander_${expanderAlign}` +
                ` controls-ListView__groupExpander-iconSize_${iconSize || 'default'}` +
                ` controls-ListView__groupExpander-iconStyle_${iconStyle || 'default'}`;
        }
        return classes;
    }

    shouldDisplayLeftSeparator(
        separatorVisibility: boolean,
        textVisible: boolean,
        textAlign: string
    ): boolean {
        return separatorVisibility !== false && textVisible !== false && textAlign !== 'left';
    }

    shouldDisplayRightSeparator(
        separatorVisibility: boolean,
        textVisible: boolean,
        textAlign: string
    ): boolean {
        return separatorVisibility !== false && (textAlign !== 'right' || textVisible === false);
    }

    /**
     * Классы для настройки базовой линии группы.
     * @param templateFontSize
     * @private
     */
    getBaseLineClasses(templateFontSize?: TFontSize): string {
        let classes = ' controls-ListView__groupContent_baseline ';
        if (
            templateFontSize &&
            templateFontSize !== 's' &&
            templateFontSize !== 'xs' &&
            templateFontSize !== 'inherit'
        ) {
            classes += ` controls-ListView__groupContent_baseline_${templateFontSize}`;
        } else {
            classes += ' controls-ListView__groupContent_baseline_default';
        }
        return classes;
    }

    abstract isExpanded(): boolean;
    abstract getDirectionality(): string;
    abstract getGroupPaddingClasses(side: 'left' | 'right'): string;
}
