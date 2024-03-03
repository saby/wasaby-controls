import { Logger } from 'UI/Utils';
import { complementaryHueForDarkTheme, isDarkTheme } from 'Controls/Utils/Helpers/functions';

export interface IRgb {
    r: number;
    g: number;
    b: number;
}

export interface IRgba extends IRgb {
    a: number;
}

export interface IHsv {
    h: number;
    s: number;
    v: number;
}

export interface IHsl {
    h: number;
    s: number;
    l: number;
}

export interface IHsla extends IHsl {
    a: number;
}

export function toRgb(rawColor: string): IRgba {
    if (typeof rawColor !== 'string') {
        return null;
    }
    let color = rawColor.toLowerCase();
    const shorthandRegexRgba = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d]?)$/i;
    color = color.replace(shorthandRegexRgba, (m, r, g, b, a) => {
        if (!a) {
            a = 'f';
        }
        return r + r + g + g + b + b + a + a;
    });
    let result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color) ||
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseInt(result[4] || 'ff', 16) / 255,
        };
    } else {
        color = color.split(' ').join('');
        result =
            /^rgba\(([\d]+),([\d]+),([\d]+),([\d.]+)\)$/i.exec(color) ||
            /^rgb\(([\d]+),([\d]+),([\d]+)\)$/i.exec(color);
        if (result) {
            return {
                r: parseInt(result[1], 10),
                g: parseInt(result[2], 10),
                b: parseInt(result[3], 10),
                a: parseFloat(result[4] || '1'),
            };
        } else {
            Logger.warn(`hexToRgb: ${color} не является валидным rgb, rgba или hex-цветом.`);
            return {
                r: 255,
                g: 255,
                b: 255,
                a: 1,
            };
        }
    }
}

export function rgbToRgba(rgb: IRgb, a: number = 1): IRgba {
    if (!rgb) {
        return null;
    }
    return { ...rgb, a };
}

export function rgbaToString(rgba: IRgba): string {
    if (!rgba) {
        return null;
    }
    const { r, g, b, a } = rgba;
    return `rgba(${r},${g},${b},${a})`;
}

const MAX_RGB = 255;
const DEG = 360;
const ZERO = 0;
const DOUBLE = 2;
const RGB_R_COEF = 6;
const RGB_G_COEF = 2;
const RGB_B_COEF = 4;
const MAX_HSL_VAL = 100;
const FIRST_RGB_COEF = 60;
const SECOND_RGB_COEF = 120;
const THIRD_RGB_COEF = 180;
const FOURTH_RGB_COEF = 240;
const FIFTH_RGB_COEF = 300;
const FRACTION_DIGITS = 1;
const DEGREE_MULTIPLIER = 60;

export function hexToHsla(hex: string): IHsla {
    const rgb = toRgb(hex);
    const { h, s, l } = hexToHsl(hex);
    return {
        h,
        s,
        l,
        a: rgb.a,
    };
}

// saturation и lightness в процентах.
export function hslToRgb(hue: number, saturation: number, lightness: number, alpha?: number): IRgb {
    // Must be fractions of 1
    const s = (saturation > MAX_HSL_VAL ? MAX_HSL_VAL : saturation) / MAX_HSL_VAL;
    const l = (lightness > MAX_HSL_VAL ? MAX_HSL_VAL : lightness) / MAX_HSL_VAL;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / FIRST_RGB_COEF) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (ZERO <= hue && hue < FIRST_RGB_COEF) {
        r = c;
        g = x;
        b = ZERO;
    } else if (FIRST_RGB_COEF <= hue && hue < SECOND_RGB_COEF) {
        r = x;
        g = c;
        b = ZERO;
    } else if (SECOND_RGB_COEF <= hue && hue < THIRD_RGB_COEF) {
        r = ZERO;
        g = c;
        b = x;
    } else if (THIRD_RGB_COEF <= hue && hue < FOURTH_RGB_COEF) {
        r = ZERO;
        g = x;
        b = c;
    } else if (FOURTH_RGB_COEF <= hue && hue < FIFTH_RGB_COEF) {
        r = x;
        g = ZERO;
        b = c;
    } else if (FIFTH_RGB_COEF <= hue && hue < DEG) {
        r = c;
        g = ZERO;
        b = x;
    }
    r = Math.round((r + m) * MAX_RGB);
    g = Math.round((g + m) * MAX_RGB);
    b = Math.round((b + m) * MAX_RGB);
    const result = { r, g, b };
    if (alpha !== undefined) {
        result.a = alpha;
    }
    return result;
}

export function hexToHsl(hex: string): IHsl {
    // Convert hex to RGB first
    // eslint-disable-next-line prefer-const
    let { r, g, b, a } = toRgb(hex);
    r /= MAX_RGB;
    g /= MAX_RGB;
    b /= MAX_RGB;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h;
    // Calculate hue
    if (delta === ZERO) {
        // No difference
        h = ZERO;
    } else if (cmax === r) {
        // Red is max
        h = ((g - b) / delta) % RGB_R_COEF;
    } else if (cmax === g) {
        // Green is max
        h = (b - r) / delta + RGB_G_COEF;
    } else {
        // Blue is max
        h = (r - g) / delta + RGB_B_COEF;
    }
    h = h * DEGREE_MULTIPLIER;
    // Make negative hues positive behind 360°
    if (h < ZERO) {
        h += DEG;
    }
    // Calculate lightness
    let l = (cmax + cmin) / 2;
    // Calculate saturation
    let s = delta === ZERO ? ZERO : delta / (1 - Math.abs(DOUBLE * l - 1));
    // Multiply l and s by 100
    s = s * MAX_HSL_VAL;
    l = l * MAX_HSL_VAL;
    return { h, s, l, a };
}

export function rgbToHsv(rgb: IRgb): IHsv {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    const v = max;

    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {
        h,
        s,
        v,
    };
}

export function hsvToRgb(hsv: IHsv): IRgb {
    let r;
    let g;
    let b;

    const i = Math.floor(hsv.h * 6);
    const f = hsv.h * 6 - i;
    const p = hsv.v * (1 - hsv.s);
    const q = hsv.v * (1 - f * hsv.s);
    const t = hsv.v * (1 - (1 - f) * hsv.s);

    switch (i % 6) {
        case 0:
            r = hsv.v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = hsv.v;
            b = p;
            break;
        case 2:
            r = p;
            g = hsv.v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = hsv.v;
            break;
        case 4:
            r = t;
            g = p;
            b = hsv.v;
            break;
        case 5:
            r = hsv.v;
            g = p;
            b = q;
            break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

export function hslToHex(hsl: number[]): string {
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2], hsl[3]);
    return rgbToHex(rgb.r, rgb.g, rgb.b, rgb.a);
}

export function rgbToHex(red: number, green: number, blue: number, alpha?: number): string {
    let result = `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
    if (alpha !== undefined) {
        result += `${alphaToHex(alpha)}`;
    }
    return result;
}

export function componentToHex(component: number): string {
    const hex = component.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

export function alphaToHex(alpha: number): string {
    let result = Math.round(+alpha * 255).toString(16);
    if (result.length === 1) {
        result = '0' + result;
    }
    return result;
}

export function getComplementaryColor(dominantColor: IRgb): IRgb {
    const dominantColorInHsv = rgbToHsv(dominantColor);
    let complementaryInHsv: IHsv;

    if (isDarkTheme(dominantColor)) {
        complementaryInHsv = {
            h: complementaryHueForDarkTheme(dominantColorInHsv.h),
            s: 0.45,
            v: 0.85,
        };
    } else {
        complementaryInHsv = {
            h: dominantColorInHsv.h,
            s: dominantColorInHsv.s + (dominantColorInHsv.s > 0.2 ? 1 - dominantColorInHsv.s : 0.8),
            v: dominantColorInHsv.v + (dominantColorInHsv.v < 0.5 ? 0.3 : -0.3),
        };
    }

    return hsvToRgb(complementaryInHsv);
}
