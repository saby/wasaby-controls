import { constants } from 'Env/Env';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';

const FONTS_MODULE_NAME = 'Controls/Utils/FontConstantsLoader';

type TFontSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

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

function calcFontWidth(value: string, size: TFontSize, fonts: []): number {
    let text = value;
    if (!text) {
        text = '';
    }

    let textWidth = 0;
    for (let i = 0; i < text.length; i++) {
        // default усредненное значение символа, которого нет в словаре
        const charWidth = fonts[size]
            ? fonts[size][text[i]] || fonts[size].default
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
