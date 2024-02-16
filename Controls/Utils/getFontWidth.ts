/**
 * @kaizen_zone 8bfb04d1-3e35-47c6-bb1e-3659dd068450
 */
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import { unsafe_getRootAdaptiveMode } from 'UICore/Adaptive';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';

const FONTS_MODULE_NAME = 'Controls/Utils/FontConstantsLoader';

type TFontSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

function generateErrorMessage(): void {
    const message = `Получение размеров текста было вызвано до загрузки данных с размерами. Для корректной работы
        необходимо вызвать метод loadFontWidthConstants`;
    Logger.error(`Utils/getFontWidth: ${message}`);
}

/**
 * Вычисляет ширину в пикселях для переданной строки
 * @param value - текс чью ширину нужно высчитать
 * @param size - размер текста
 */
export function getFontWidth(value: string, size: TFontSize): number {
    if (!ModulesLoader.isLoaded(FONTS_MODULE_NAME)) {
        generateErrorMessage();
        return 0;
    }

    const fonts = ModulesLoader.loadSync(FONTS_MODULE_NAME) as [];
    return calcFontWidth(value, size, fonts);
}

const hashMapWithSizesForAdaptive: {
    [key: string]: TFontSize;
} = {
    ['3xs']: 'xs',
    ['2xs']: 's',
    ['xs']: 'm',
    ['s']: 'l',
    ['m']: 'xl',
    ['l']: '2xl',
    ['xl']: '3xl',
    ['2xl']: '4xl',
    ['3xl']: '4xl',
    ['4xl']: '5xl',
    ['5xl']: '7xl',
};

function calcFontWidth(value: string, size: TFontSize, fonts: []): number {
    const currentSize =
        document?.body?.classList?.contains('_enable-bigger-fonts-for-phones') &&
        unsafe_getRootAdaptiveMode()?.device?.isPhone()
            ? hashMapWithSizesForAdaptive[size]
            : size;
    let text = value;
    if (!text) {
        text = '';
    }

    let textWidth = 0;
    for (let i = 0; i < text.length; i++) {
        // default усредненное значение символа, которого нет в словаре
        const charWidth = fonts[currentSize]
            ? fonts[currentSize][text[i]] || fonts[currentSize].default
            : 0;
        textWidth += charWidth;
    }

    return textWidth;
}

/**
 * Загружает модули, необходимые для вычисления ширины текста,
 * и как результат резолва загрузки возвращает ф-ию, для расчета.
 */
export function loadFontWidthConstants(): Promise<Function> {
    return import(FONTS_MODULE_NAME).then(() => {
        // положим файл с константами в head, чтобы на клиенте запросить синхронно
        addPageDeps([FONTS_MODULE_NAME]);

        return getFontWidth;
    });
}

/**
 * Определяет загружены ли модули.
 */
export function isFontWidthConstantsLoaded(): boolean {
    return ModulesLoader.isLoaded(FONTS_MODULE_NAME);
}
