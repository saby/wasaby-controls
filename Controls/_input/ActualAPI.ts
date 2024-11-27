/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';

/**
 * Возвращает корректное значение для опции inlineHeight
 */
export function inlineHeight(
    size: string,
    inlineHeightParam: string,
    msg: boolean = true
): string | undefined {
    if (size) {
        if (constants.isBrowserPlatform && msg) {
            Logger.error(
                'Используется устаревшая опция size. ' +
                    `нужно использовать inlineHeight="${size}" ` +
                    'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.'
            );
        }
        return size;
    }
    if (inlineHeightParam) {
        return inlineHeightParam;
    }
}

/**
 * Возвращает корректное значение для опции fontColorStyle
 */
export function fontColorStyle(
    fontStyle: string,
    fontColorStyleParam: string,
    msg: boolean = true
): string | undefined {
    if (fontStyle) {
        if (constants.isBrowserPlatform && msg) {
            Logger.error(
                'Используется устаревшая опция fontStyle. ' +
                    `нужно использовать fontColorStyle="${fontStyle}" ` +
                    'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.'
            );
        }
        return fontStyle;
    }
    if (fontColorStyleParam) {
        return fontColorStyleParam;
    }
}

/**
 * Возвращает корректное значение для опции fontSise
 */
export function fontSize(
    fontStyle: string,
    fontSizeParam: string,
    msg: boolean = true
): string | undefined {
    if (fontStyle) {
        let result;
        if (fontStyle === 'primary' || fontStyle === 'secondary') {
            result = '3xl';
        }
        if (constants.isBrowserPlatform && msg) {
            Logger.error(
                'Используется устаревшая опция fontStyle. ' +
                    `нужно использовать fontSize="${result}" ` +
                    'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.'
            );
        }
        return result || 'm';
    }
    if (fontSizeParam) {
        return fontSizeParam;
    }
}

interface IOptions {
    size: string;
    inlineHeight: string;
    fontStyle: string;
    fontColorStyle: string;
    fontSize: string;
}

interface ISelf {
    _inlineHeight?: string;
    _fontColorStyle?: string;
    _fontSize?: string;
}

/**
 * Возвращает корректное значение для опций полей ввода
 */
export function generateStates(self: ISelf, options: IOptions): void {
    self._inlineHeight = inlineHeight(options.size, options.inlineHeight, false);
    self._fontColorStyle = inlineHeight(options.fontStyle, options.fontColorStyle, false);
    self._fontSize = inlineHeight(options.fontStyle, options.fontSize, false);
}

/**
 * Возвращает корректное значение для опции validationStatus
 */
export function validationStatus(style: string, validationStatusParam: string): string {
    if (validationStatusParam) {
        return validationStatusParam;
    }

    switch (style) {
        case 'invalid':
            return 'invalid';
        case 'info':
        default:
            return 'valid';
    }
}
