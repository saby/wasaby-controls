import { MouseKey } from './constants';

/**
 * Перемещает курсор мыши на указанные координаты и выполняет клик.
 * @param xCoord координата по оси x
 * @param yCoord координата по оси y
 * @param xOffset смещение по оси x
 * @param yOffset смещение по оси y
 * @param button Код кнопки, которую требуется нажать.
 * @author Аверкиев П.А.
 */
export async function clickOnCoordinates(
    xCoord: number,
    yCoord: number,
    xOffset: number = 0,
    yOffset: number = 0,
    button: MouseKey = MouseKey.left
): Promise<void> {
    // to escape "x/y must be an int" error
    const x = Math.round(xCoord + xOffset);
    const y = Math.round(yCoord + yOffset);
    await browser.performActions([
        {
            type: 'pointer',
            id: 'pointer1',
            parameters: { pointerType: 'mouse' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y },
                { type: 'pointerDown', button },
                { type: 'pointerUp', button },
            ],
        },
    ]);
}
