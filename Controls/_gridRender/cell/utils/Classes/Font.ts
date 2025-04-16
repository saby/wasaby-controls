/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IFontProps } from 'Controls/interface';

/**
 * Утилита, предоставляющая CSS классы размера шрифта
 * @private
 */
export function getFontSizeClasses(fontSize?: IFontProps['fontSize']) {
    if (fontSize && fontSize !== 'inherit') {
        return ` controls-fontsize-${fontSize}`;
    }
    return '';
}

/**
 * Утилита, предоставляющая CSS классы цвета текста
 * @private
 */
export function getFontColorStyleClasses(fontColorStyle: IFontProps['fontColorStyle']) {
    if (fontColorStyle) {
        return ` controls-text-${fontColorStyle}`;
    }
    return '';
}

/**
 * Утилита, предоставляющая CSS классы насыщенности шрифта
 * @private
 */
export function getFontWeightClasses(fontWeight: IFontProps['fontWeight']) {
    if (fontWeight) {
        return ` controls-fontweight-${fontWeight}`;
    }
    return '';
}

/**
 * Утилита, предоставляющая CSS классы различных характеристик шрифта и текста
 * @private
 */
export function getFontClasses(props: IFontProps) {
    return (
        getFontSizeClasses(props.fontSize) +
        getFontWeightClasses(props.fontWeight) +
        getFontColorStyleClasses(props.fontColorStyle)
    );
}
