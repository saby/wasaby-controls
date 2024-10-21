import { TFontSize } from 'Controls/interface';

export function getFontSizeClasses(fontSize?: TFontSize) {
    if (fontSize && fontSize !== 'inherit') {
        return ` controls-fontsize-${fontSize}`;
    }

    return '';
}
