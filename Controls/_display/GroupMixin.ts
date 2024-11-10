/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
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

    abstract getGroupPaddingClasses(side: 'left' | 'right'): string;
}
