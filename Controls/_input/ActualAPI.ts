/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';

export function inlineHeight(size: string, inlineHeightParam: string, msg: boolean = true): string {
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

export function fontColorStyle(
    fontStyle: string,
    fontColorStyleParam: string,
    msg: boolean = true
): string {
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

export function fontSize(fontStyle: string, fontSizeParam: string, msg: boolean = true): string {
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

export function generateStates(self: object, options: object): void {
    self._inlineHeight = inlineHeight(options.size, options.inlineHeight, false);
    self._fontColorStyle = inlineHeight(options.fontStyle, options.fontColorStyle, false);
    self._fontSize = inlineHeight(options.fontStyle, options.fontSize, false);
}

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
