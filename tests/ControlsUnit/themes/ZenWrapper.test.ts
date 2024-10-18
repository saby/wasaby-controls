import { calculateRGB, calculateVariables } from 'Controls/themesExt';
import { Logger } from 'UI/Utils';

interface IRgb {
    r: number;
    g: number;
    b: number;
}

describe('Controls/themesExt:ZenWrapper', () => {
    beforeEach(() => {
        // TODO: мб не всем этим тестам это нужно, но тут нужно пол файла переписать, чтобы сделать нормально
        jest.spyOn(Logger, 'warn').mockImplementation();
    });

    it('calculateRGB', () => {
        let result: IRgb;
        const emptyResult: IRgb = { r: 255, g: 255, b: 255 };

        result = calculateRGB('45,45,45');
        expect({ r: 45, g: 45, b: 45 }).toEqual(result);

        result = calculateRGB('45, 45, 45');
        expect({ r: 45, g: 45, b: 45 }).toEqual(result);

        result = calculateRGB('rgb(45, 45, 45)');
        expect({ r: 45, g: 45, b: 45 }).toEqual(result);

        result = calculateRGB('(45,  45)');
        expect(emptyResult).toEqual(result);

        result = calculateRGB('');
        expect(emptyResult).toEqual(result);

        result = calculateRGB('#ccc');
        expect({ r: 204, g: 204, b: 204 }).toEqual(result);
    });

    it('calculateVariables', () => {
        const result = calculateVariables({ r: 45, g: 46, b: 47 }, { r: 13, g: 14, b: 15 }, 'dark');
        expect({
            '--dominant-color_zen': 'rgb(45,46,47)',
            '--dominant_zen_rgb': '45,46,47',
            '--complementary-color_zen': 'rgb(13,14,15)',
            '--complementary_zen_rgb': '13,14,15',
            '--mono_zen_rgb': '255,255,255',
        }).toEqual(result);
    });
});
