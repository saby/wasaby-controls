/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
import { IHSLColor, IColorDescriptor } from './interface/IColor';
import { hslToRgb, hexToHsl, rgbaToString, rgbToRgba } from 'Controls/Utils/colorUtil';

const HEXADECIMAL = 16;
const intToHex = (n: number): string => {
    const str = n.toString(HEXADECIMAL);
    return str.length === 1 ? '0' + str : str;
};
const prefixes = ['primary', 'secondary', 'danger', 'success', 'warning', 'info'];
const colorTemplate = {
    color: [
        { name: 'text-color', S: 0.66, L: 0.79 },
        { name: 'hover_text-color', S: 1.4, L: 0.7 },
        { name: 'icon-color', S: 1.05, L: 1.15 },
        { name: 'hover_icon-color', S: 1.4, L: 0.7 },
        { name: 'border-color', S: 1.05, L: 1.15 },
        { name: 'background-color', S: 100, L: 98, isStrict: true },
        { name: 'hover_background-color', S: 100, L: 96, isStrict: true },
        { name: 'active_background-color', S: 100, L: 93, isStrict: true },
        { name: 'same_background-color', S: 100, L: 96, isStrict: true },
        { name: 'hover_same_background-color', S: 100, L: 93, isStrict: true },
        { name: 'active_same_background-color', S: 100, L: 90, isStrict: true },
        { name: 'contrast_background-color', S: 1.5, L: 1.25 },
        { name: 'hover_contrast_background-color', S: 1.6, L: 1.16 },
        { name: 'active_contrast_background-color', S: 1.92, L: 1.32 },
    ],
    'text-color': [{ name: 'hover_text-color', S: 2.121, L: 0.886 }],
    'icon-color': [{ name: 'hover_icon-color', S: 1.333, L: 0.609 }],
    'background-color': [
        { name: 'hover_background-color', S: 1, L: 0.9796 },
        { name: 'active_background-color', S: 1, L: 0.949 },
    ],
    'same_background-color': [
        { name: 'hover_same_background-color', S: 1, L: 0.96875 },
        { name: 'active_same_background-color', S: 1, L: 0.967 },
    ],
    'contrast_background-color': [
        { name: 'hover_contrast_background-color', S: 1.067, L: 0.928 },
        { name: 'active_contrast_background-color', S: 1.28, L: 1.056 },
    ],
};

const unaccentedColorCallback = (baseColor: IHSLColor, variableName: string): IHSLColor => {
    let resultColor: IHSLColor;
    switch (variableName) {
        case '--pale_contrast_background-color':
            resultColor = {
                h: baseColor.s === 0 ? 220 : baseColor.h,
                s: 13,
                l: 91,
            };
            break;
        case '--pale_active_contrast_background-color':
            resultColor = {
                h: baseColor.s === 0 ? 220 : baseColor.h,
                s: 7,
                l: 86,
            };
            break;
        default:
            resultColor = { ...baseColor };
    }
    return resultColor;
};

// Цвета, зависящие от основной палитры + неакцентные
const additionalColors = {
    '--primary_color': [{ name: '--marker_color', S: 1, L: 1 }],
    '--secondary_color': [{ name: '--readonly_marker-color', S: 0.66, L: 0.79 }],
    '--unaccented_color': [
        { name: '--label_text-color', S: 1, L: 1 }, // FIXME коэффициенты
        { name: '--unaccented_text-color', S: 0.66, L: 0.79 },
        { name: '--unaccented_icon-color', S: 1.05, L: 1.15 },
        { name: '--unaccented_hover_icon-color', S: 1.4, L: 0.7 },
        { name: '--unaccented_border-color', S: 1.05, L: 1.15 },
        { name: '--unaccented_hover_border-color', S: 1.4, L: 0.7 },
        { name: '--unaccented_background-color', S: 0, L: 98, isStrict: true },
        {
            name: '--pale_contrast_background-color',
            callback: unaccentedColorCallback,
        },
        {
            name: '--pale_active_contrast_background-color',
            callback: unaccentedColorCallback,
        },
        { name: '--unaccented_contrast_background-color', S: 1.5, L: 1.25 },
        {
            name: '--unaccented_hover_contrast_background-color',
            S: 1.6,
            L: 1.16,
        },
        {
            name: '--unaccented_active_contrast_background-color',
            S: 1.92,
            L: 1.32,
        },
        { name: '--pale_contrast_background-color', S: 1.5, L: 1.25 }, // FIXME коэффициенты
        { name: '--pale_hover_contrast_background-color', S: 1.6, L: 1.16 }, // FIXME коэффициенты
        { name: '--pale_active_contrast_background-color', S: 1.92, L: 1.32 }, // FIXME коэффициенты
        { name: '--pale_border-color', S: 1.05, L: 1.15 }, // FIXME коэффициенты
    ],
    '--unaccented_contrast_background-color': [
        {
            name: '--unaccented_hover_contrast_background-color',
            S: 1.067,
            L: 0.928,
        },
        {
            name: '--unaccented_active_contrast_background-color',
            S: 1.28,
            L: 1.056,
        },
    ],
    '--unaccented_icon-color': [{ name: '--unaccented_hover_icon-color', S: 1.333, L: 0.609 }],
    '--contrast_text-color': [{ name: '--contrast_icon-color', S: 1, L: 1 }],
};
const calculateColor = (clr: IHSLColor, desc: IColorDescriptor): IHSLColor => {
    return desc.isStrict
        ? { h: clr.h, s: desc.S, l: desc.L }
        : { h: clr.h, s: clr.s * desc.S, l: clr.l * desc.L };
};
/**
 * Вычисление цветов, зависящих от базовых на основе шаблона трансформации
 * @param {Record<string, string>} colors базовые цвета
 * @param {Record<string, IColorDescriptor[]>} transformTemplate шаблон трансформации цветов
 * @param {string} [prefix] префикс, который нужно добавить к названиям цветов в результате
 * @return {Record<string, string>} объект с палитрой цветов, вычисленных на основе переданных
 */
const processColorVariables = (
    colors: Record<string, string>,
    transformTemplate: Record<string, IColorDescriptor[]>,
    prefix?: string
): Record<string, string> => {
    const result: Record<string, string> = {};
    for (const coefName in transformTemplate) {
        if (transformTemplate.hasOwnProperty(coefName)) {
            const mainColorName = prefix ? `--${prefix}_${coefName}` : coefName;
            if (colors[mainColorName]) {
                const baseColor = hexToHsl(colors[mainColorName]);
                transformTemplate[coefName].forEach((colorDesc: IColorDescriptor) => {
                    const subColorName = prefix ? `--${prefix}_${colorDesc.name}` : colorDesc.name;
                    // пропускаем переменные, значения которых пришло в аргументах. Их рассчитывать не нужно.
                    if (!colors[subColorName]) {
                        const convertedColor = colorDesc.callback
                            ? colorDesc.callback(baseColor, subColorName)
                            : calculateColor(baseColor, colorDesc);
                        const rgbColor = hslToRgb(
                            convertedColor.h,
                            convertedColor.s,
                            convertedColor.l
                        );
                        if (colorDesc.transparent) {
                            result[subColorName] = rgbaToString(rgbToRgba(rgbColor, 0));
                        } else {
                            result[subColorName] =
                                '#' +
                                intToHex(rgbColor.r) +
                                intToHex(rgbColor.g) +
                                intToHex(rgbColor.b);
                        }
                    }
                });
            }
        }
    }
    return result;
};
/**
 * Вычисляет палитру цветов Controls в зависимости от переданных в параметре базовых цветов
 * @param {Record<string, string>} colors объект с HEX значениями цветов
 * @return {Record<string, string>} объект с палитрой цветов, вычисленных на основе базовых
 */
const calculateControlsTheme = (colors: Record<string, string>): Record<string, string> => {
    let result = { ...colors };
    prefixes.forEach((prefix) => {
        result = {
            ...result,
            ...processColorVariables(colors, colorTemplate, prefix),
        };
    });
    result = { ...result, ...processColorVariables(colors, additionalColors) };
    return result;
};

export { processColorVariables, calculateControlsTheme, intToHex };
