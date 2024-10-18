/**
 * Набор общих утилитарных функций, для взаимодействия с QWERTY клавиатурой
 * @library
 * @public
 */

import { SyntheticEvent } from 'UICommon/Events';
import { getTextWidth } from 'Controls/sizeUtils';
import { constants } from 'Env/Constants';

/**
 * Интерфейс активного в данный момент поля ввода
 * @private
 */
interface IInputInfo {
    /**
     * Активное поле ввода
     */
    input: HTMLInputElement;

    /**
     * Размер текста активного поля ввода
     */
    fontSizeOfInput: number;
}

/**
 * Обработчик фокусировки на поле ввода
 * @param event событие фокусировки
 */
function focusIn(event: SyntheticEvent): IInputInfo | void {
    const target = event.nativeEvent.target as HTMLInputElement;

    if (target && target.tagName && target.tagName.toLowerCase() === 'input') {
        const fontSize = window.getComputedStyle(target).fontSize.match(/\d+/)[0];
        return {
            input: target,
            fontSizeOfInput: parseFloat(fontSize),
        };
    }
}

/**
 *  Интерфейс положения каретки в строке
 * @private
 */
interface IPositionsOfCaret {
    /**
     * Начальное положение каретки в выделении
     */
    selectionStart: number;

    /**
     * Длина выделенного фрагмента
     */
    length: number;
}

/**
 * Функция, для определения корректного положения каретки и выделенного текста
 * @param isSymbol является ли нажатая клавиша символом
 * @param positionsOfCaret положение каретки
 * @param inputLength длина переданной строки
 */
function choosePositionsOfCaret(
    isSymbol: boolean,
    positionsOfCaret: IPositionsOfCaret,
    inputLength: number
): IPositionsOfCaret {
    let currentPositionsOfCaret: IPositionsOfCaret;

    if (!positionsOfCaret && isSymbol) {
        /* Если введен символ и отсутствует положение каретки,
        то устанавливаем каретку в конец строки */
        currentPositionsOfCaret = {
            selectionStart: inputLength,
            length: 0,
        };
    } else if (!positionsOfCaret && !isSymbol) {
        /* Если введен не символ и отсутствует положение каретки,
        то устанавливаем каретку на предпоследний символ и выделяем его для удаления */
        currentPositionsOfCaret = {
            selectionStart: inputLength - 1,
            length: 1,
        };
    } else if (positionsOfCaret && !isSymbol && !positionsOfCaret.length) {
        /* Если введен не символ, но присутствует положение каретки,
        то смещаем каретку на 1 ближе к началу и выделяем символ для удаления */
        currentPositionsOfCaret = {
            selectionStart: positionsOfCaret.selectionStart - 1,
            length: 1,
        };
    } else {
        currentPositionsOfCaret = positionsOfCaret;
    }

    return currentPositionsOfCaret;
}

/**
 * Интерфейс возвращаемых значений после изменения строки
 * @private
 */
interface IChangeString {
    /**
     * Итоговая строка
     */
    resultStr: string;

    /**
     * Используемые данные о положении каретки
     */
    usingPositions: IPositionsOfCaret;
}

/**
 * Функция для изменения строки после нажатия клавиши
 * @param inputStr исходная строка
 * @param clickButton нажатая клавиша
 * @param positionsOfCaret положение каретки в строке
 */
function changeStringAfterClick(
    inputStr: string,
    clickButton: string,
    positionsOfCaret?: IPositionsOfCaret
): IChangeString {
    const symbol: string = clickButton === 'backspace' ? '' : clickButton;

    let resultStr = '';
    const usingPositions: IPositionsOfCaret = choosePositionsOfCaret(
        !!symbol,
        positionsOfCaret,
        inputStr.length
    );

    const arrOfSymbols = inputStr.split('') || [];
    arrOfSymbols.splice(usingPositions.selectionStart, usingPositions.length, symbol);
    resultStr = arrOfSymbols.join('');

    // Если ввели символ, перевести каретку вперед на символ
    if (!!symbol) {
        usingPositions.selectionStart += 1;
    }

    // Убираем выделение
    usingPositions.length = 0;

    return {
        resultStr,
        usingPositions,
    };
}

/**
 * Функция для выбора величины скролла в input
 * @param input элемент DOMа для ввода текста
 * @param sizeOfText размер текста в input
 */
function getScrollLeft(input: HTMLInputElement, sizeOfText?: number): number {
    // Если потенциальный скролл меньше или равен ширине поля, то возвращаем 0
    if (input.scrollWidth <= input.offsetWidth) {
        return 0;
    }

    // Если вводили в самом конце строки, то возвращаем максимальное значение
    if (input.selectionStart === input.value.length) {
        return input.scrollWidth;
    }

    // Вычисляем ширину подстроки от начала до положения каретки
    const needSubstring = input.value.slice(0, input.selectionStart + 1);
    let widthOfSubstring;

    // Если задан размер шрифта, то используем его
    if (sizeOfText) {
        widthOfSubstring = getTextWidth(needSubstring, sizeOfText, false);
    } else {
        widthOfSubstring = getTextWidth(needSubstring);
    }

    // Если видимая часть подстроки меньше ширины поля ввода, то возвращаем текущее значение
    if (widthOfSubstring - input.scrollLeft <= input.offsetWidth) {
        return input.scrollLeft;
    }

    // Иначе возвращаем разницу между шириной подстроки и шириной поля ввода
    return widthOfSubstring - input.offsetWidth;
}

/**
 * @typedef {Object} IOptionsItemPressCallback
 * @property {HTMLInputElement} focusedInput активное поле ввода
 * @property {number} fontSizeOfInput размер шрифта в активном поле ввода
 * @property {HTMLElement} elemForChangeFocus элемент для смены фокуса
 * @property {Function} accentButtonPressCallback коллбек нажатия акцентной кнопки
 */
interface IOptionsItemPressCallback {
    focusedInput: HTMLInputElement;
    fontSizeOfInput: number;
    elemForChangeFocus: HTMLElement;
    accentButtonPressCallback?: (focusedInput: HTMLInputElement) => void;
}

/**
 * Обработчик нажатия клавиш на экранной клавиатуре
 * @param options опции для обработчика нажатия клавиш на клавиатуре
 * @param button нажатая клавиша
 */
function itemPressCallback(options: IOptionsItemPressCallback, button: string): void {
    const { accentButtonPressCallback, focusedInput, fontSizeOfInput, elemForChangeFocus } =
        options;
    const selection: IPositionsOfCaret = {
        selectionStart: Math.min(focusedInput.selectionStart, focusedInput.selectionEnd) || 0,
        length: Math.abs(focusedInput.selectionStart - focusedInput.selectionEnd) || 0,
    };
    switch (button) {
        case 'keyboard':
            /* Закрытие клавиатуры. Необходимо фокусироваться на каком-то элементе из-за использования в
               клавиатуре preventDefault по событию mousedown. */
            elemForChangeFocus.focus();
            break;
        case 'accentButton':
            if (accentButtonPressCallback) {
                accentButtonPressCallback(focusedInput);
            } else {
                elemForChangeFocus.focus();
            }
            break;
        default:
            const newData = changeStringAfterClick(focusedInput.value, button, selection);
            focusedInput.value = newData.resultStr;

            /* Поскольку вводится один символ и нам не нужно выделение текста, устанавливаем для
               selectionStart и selectionEnd одинаковые значения */
            focusedInput.selectionStart = newData.usingPositions.selectionStart;
            focusedInput.selectionEnd = newData.usingPositions.selectionStart;
            focusedInput.scrollLeft = getScrollLeft(focusedInput, fontSizeOfInput);

            dispatchInputEvent(focusedInput, focusedInput.value);
    }
}

/**
 * Создать событие InputEvent
 * @param input поле ввода, для которого создается событие
 * @param data строка, которая находится в поле ввода в настоящий момент
 */
function dispatchInputEvent(input: HTMLInputElement, data: string): void {
    input.dispatchEvent(
        new InputEvent('input', {
            data,
            view: window,
            bubbles: true,
            cancelable: true,
        })
    );
}

/**
 * Функция для определения размера открываемой клавиатуры
 * @return {String} Возвращает размер открываемой клавиатуры
 */
function getSizeOfKeyboard(): 's' | 'l' {
    // Если построение не в браузере установить минимальный размер
    if (constants.isBrowserPlatform) {
        const widthOfScreenForBigQwerty = 1024;
        return window.innerWidth >= widthOfScreenForBigQwerty ? 'l' : 's';
    }
    return 's';
}

export {
    IInputInfo,
    focusIn,
    IPositionsOfCaret,
    choosePositionsOfCaret,
    IChangeString,
    changeStringAfterClick,
    getScrollLeft,
    itemPressCallback,
    dispatchInputEvent,
    getSizeOfKeyboard,
    IOptionsItemPressCallback,
};
