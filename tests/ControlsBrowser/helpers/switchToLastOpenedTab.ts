/**
 * Переключается на последнюю открытую вкладку.
 * @author Зайцев А.С.
 */
export async function switchToLastOpenedTab(): Promise<void> {
    let lastWindowHandle;
    await browser.waitUntil(
        async () => {
            const localWindows = await browser.getWindowHandles();
            const result =
                localWindows.length > 1 &&
                localWindows[localWindows.length - 1] !== '';
            if (result) {
                lastWindowHandle = localWindows[localWindows.length - 1];
            }
            return result;
        },
        {
            timeoutMsg: 'Количество окон не изменилось.',
        }
    );
    return browser.switchToWindow(lastWindowHandle);
}
