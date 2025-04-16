import { UNICODE_CHARACTERS, MouseKey } from './constants';

/**
 * Производит клик с указанным модификатором по элементу, например, Ctrl+ЛКМ.
 * Перед вызовом нужно навести мышь на элемент, например, с помощью element.moveTo().
 * @param element Элемент по которому нужно кликнуть.
 * @param modifier Название или код модификатора. Полный список указан здесь: https://w3c.github.io/webdriver/#keyboard-actions.
 * @param button Код кнопки, которую требуется нажать.
 * @author Зайцев А.С.
 */
export async function clickWithModifier(
    element: ReturnType<WebdriverIO.Browser['$']>,
    modifier: string,
    button: MouseKey = MouseKey.left
): Promise<void> {
    const normalizedModifier = browser.config.hostname ? UNICODE_CHARACTERS[modifier] : modifier;
    await browser.performActions([
        {
            type: 'key',
            id: 'keyboard',
            actions: [{ type: 'keyDown', value: normalizedModifier }],
        },
    ]);
    await element.click();
    await browser.performActions([
        {
            type: 'key',
            id: 'keyboard2',
            actions: [{ type: 'keyUp', value: normalizedModifier }],
        },
    ]);
}
