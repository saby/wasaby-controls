import { IRgb } from 'Controls/Utils/colorUtil';

//# region COMPLEMENTARY COLOR

const complimentaryHueForDarkThemeCoefficientsX8: number = -9.75573e-16;
const complimentaryHueForDarkThemeCoefficientsX7: number = 1.6845e-12;
const complimentaryHueForDarkThemeCoefficientsX6: number = -1.20142e-9;
const complimentaryHueForDarkThemeCoefficientsX5: number = 4.56088e-7;
const complimentaryHueForDarkThemeCoefficientsX4: number = -9.87556e-5;
const complimentaryHueForDarkThemeCoefficientsX3: number = 0.0120462;
const complimentaryHueForDarkThemeCoefficientsX2: number = -0.742582;
const complimentaryHueForDarkThemeCoefficientsX1: number = 15.4529;
const complimentaryHueForDarkThemeCoefficientsX0: number = 193.993;

export function complementaryHueForDarkTheme(hueSrc: number): number {
    const hue = hueSrc * 360;
    return (
        ((complimentaryHueForDarkThemeCoefficientsX8 * Math.pow(hue, 8) +
            complimentaryHueForDarkThemeCoefficientsX7 * Math.pow(hue, 7) +
            complimentaryHueForDarkThemeCoefficientsX6 * Math.pow(hue, 6) +
            complimentaryHueForDarkThemeCoefficientsX5 * Math.pow(hue, 5) +
            complimentaryHueForDarkThemeCoefficientsX4 * Math.pow(hue, 4) +
            complimentaryHueForDarkThemeCoefficientsX3 * Math.pow(hue, 3) +
            complimentaryHueForDarkThemeCoefficientsX2 * Math.pow(hue, 2) +
            complimentaryHueForDarkThemeCoefficientsX1 * hue +
            complimentaryHueForDarkThemeCoefficientsX0) %
            360) /
        360
    );
}

export function isDarkTheme(dominantColor: IRgb): boolean {
    return 0.299 * dominantColor.r + 0.587 * dominantColor.g + 0.114 * dominantColor.b < 255 * 0.5;
}

//# endregion COMPLEMENTARY COLOR
