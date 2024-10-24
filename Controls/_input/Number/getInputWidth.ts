import { INumberInputOptions } from '../Number';

/**
 * Функция возвращает ширину для поля ввода числа
 * Ширина расчитывается под максимальное кол-ов символов, которое можно ввести в поле ввода
 * @param {Controls/input:INumberInputOptions} Опции поля ввода
 * @returns string
 */
export default function getInputWidth({
    integersLength,
    useGrouping,
    precision,
    showEmptyDecimals,
}: Partial<INumberInputOptions>): string {
    let spaces = useGrouping && integersLength > 3 ? Math.floor(integersLength / 3) : 0;
    let maxChars = integersLength as number;

    if (precision && showEmptyDecimals) {
        // Кол-во знаков после точки
        maxChars += precision;
        // + точка
        spaces += 1;
    }

    return `calc(${maxChars}ch + ${spaces}*.2em)`;
}
