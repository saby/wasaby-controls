/**
 * Набор вспомогательных утилит, необходимых для работы цветовых пометок.
 */
import { Model } from 'Types/entity';

/**
 * Утилита, которая возвращает значение цвета пометки.
 * @param item Модель пометки.
 */
export const getColor = (item: Model) => {
    return item.get('value').color.indexOf('--') !== -1
        ? 'var(' + item.get('value').color + ')'
        : item.get('value').color;
};

/**
 * Утилита, вычисляющая набор CSS-классов, необходимых для стилизации пометки.
 * @param b Жирность.
 * @param u Наличие нижнего подчёркивания.
 * @param i Курсив.
 * @param s Зачеркивание текста линией.
 */
export const getStyleClasses = ({ b, u, i, s }) => {
    const mainClass = 'Colormark__List_styleSettings_style';
    let result = '';
    if (b) {
        result += mainClass + '_bold ';
    }
    if (u) {
        result += mainClass + '_underline ';
    }
    if (i) {
        result += mainClass + '_italic ';
    }
    if (s) {
        result += mainClass + '_stroked';
    }
    return result;
};

/**
 * Данная утилита проверяет наличие поля хотя бы у одного элемента массива.
 * @param field
 * @param arr
 */
export const isElementContainsFieldOnArr = (field, arr) => {
    return arr.some((item) => item[field]);
};
