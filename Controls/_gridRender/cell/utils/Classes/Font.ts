import { IFontProps } from 'Controls/interface';

export function getFontSizeClasses(fontSize?: IFontProps['fontSize']) {
    if (fontSize && fontSize !== 'inherit') {
        return ` controls-fontsize-${fontSize}`;
    }
    return '';
}

export function getFontColorStyleClasses(fontColorStyle: IFontProps['fontColorStyle']) {
    if (fontColorStyle) {
        return ` controls-text-${fontColorStyle}`;
    }
    return '';
}

export function getFontWeightClasses(fontWeight: IFontProps['fontWeight']) {
    if (fontWeight) {
        return ` controls-fontweight-${fontWeight}`;
    }
    return '';
}

export function getFontClasses(props: IFontProps) {
    return (
        getFontSizeClasses(props.fontSize) +
        getFontWeightClasses(props.fontWeight) +
        getFontColorStyleClasses(props.fontColorStyle)
    );
}
