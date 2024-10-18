export interface IButtonStyle {
    viewMode: string;
    buttonStyle: string;
    inlineHeight: string;
    fontColorStyle?: string;
    iconStyle?: string;
    fontSize?: string;
    iconSize?: string;
}
// todo Удалить лишние утилиты.
// Должна остаться только parseStyleInClassName, где должны высчитываться только viewMode, buttonStyle и inlineHeight
// Сама утилита должна будет уехать в редактор.
// https://online.sbis.ru/opendoc.html?guid=e216703f-5fa7-4a1d-9d7a-b0139b16df6e&client=3

export function getFontColorStyle(viewMode: string, buttonStyle: string) {
    if (viewMode === 'filled') {
        if (['unaccented', 'default'].includes(buttonStyle)) {
            return 'default';
        }
        return 'contrast';
    } else if (viewMode === 'outlined') {
        return 'default';
    }
    return buttonStyle;
}

export function getIconStyle(viewMode: string, buttonStyle: string) {
    if (viewMode === 'filled') {
        if (['unaccented', 'default'].includes(buttonStyle)) {
            return 'default';
        }
        return 'contrast';
    } else if (viewMode === 'outlined') {
        return 'default';
    }
    return buttonStyle;
}

export function parseStyleInClassName(name?: string, defaultStyle: IButtonStyle = {
    viewMode: 'outlined',
    buttonStyle: 'primary',
    inlineHeight: 'm'
}): IButtonStyle {
    if (name) {
        const regStyleValue = name.match(/controls-([^_]+)_([^-]+)-([^-]+)-style/);
        const viewMode = regStyleValue?.[2] || defaultStyle.viewMode;
        const buttonStyle = regStyleValue?.[3] || defaultStyle.buttonStyle;
        const inlineHeight = name.match(/controls-button_size-(\w+)/)?.[1] || defaultStyle.inlineHeight;
        return {
            viewMode,
            buttonStyle,
            inlineHeight,
            fontColorStyle: getFontColorStyle(viewMode, buttonStyle),
            iconStyle: getIconStyle(viewMode, buttonStyle),
            fontSize: inlineHeight === '5xl' ? '3xl' : (inlineHeight === 'm' ? 'm' : 'xl'),
            iconSize: inlineHeight === '5xl' ? 'l' : (inlineHeight === 'm' ? 's' : 'm')
        };
    }
    return {
        ...defaultStyle,
        fontColorStyle: getFontColorStyle(defaultStyle.viewMode, defaultStyle.buttonStyle),
        iconStyle: getIconStyle(defaultStyle.viewMode, defaultStyle.buttonStyle),
        fontSize: defaultStyle.inlineHeight,
        iconSize: defaultStyle.inlineHeight === '5xl' ? 'l' : (defaultStyle.inlineHeight === 'm' ? 's' : 'm')
    };
}
