import { SyntheticEvent } from 'UICommon/Events';
/**
 * Модуль экспортирующий функцию, проверяющую что на клавиатуре была нажата символьная клавиша
 * @class Controls/Utils/isLetterPressedOnKeyboard
 * @public
 */

function getActiveElement(): HTMLElement | void {
    return document && (document.activeElement as HTMLElement);
}
/**
 * Возвращает признак, что на клавиатуре была нажата символьная клавиша
 * @function Controls/Utils/isLetterPressedOnKeyboard#isLetterPressedOnKeyboard
 * @param event {Event} дескриптор события
 * @returns Boolean
 */

export default function isLetterPressedOnKeyboard(event: SyntheticEvent | KeyboardEvent): boolean {
    const nativeEvent = event.nativeEvent || event;
    const isSpecialKeyPressed =
        nativeEvent.altKey || nativeEvent.ctrlKey || nativeEvent.shiftKey || nativeEvent.metaKey;
    const isLetterPressed = /^([a-zA-Z]|[а-яА-Я]|[0-9])$/.test(nativeEvent.key);
    const activeElement = getActiveElement();
    const allowProcessKeydown =
        activeElement &&
        activeElement.tagName !== 'INPUT' &&
        activeElement.tagName !== 'TEXTAREA' &&
        activeElement.getAttribute('contenteditable') !== 'true';

    return (
        !isSpecialKeyPressed &&
        isLetterPressed &&
        allowProcessKeydown &&
        nativeEvent.type === 'keydown'
    );
}
