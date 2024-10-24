/**
 * Скроллит контейнер вверх на указанное количество пикселей при помощи скрипта в браузере.
 * @param element контейнер, в котором необходимо установить новое значение scrollTop.
 * @param value значение scrollTop
 * @example
 * <pre brush-'js'>
 * const scrollContent = await $('[data-qa="controls-Scroll__content"]');
 * await setScrollTopOn(scrollContent, 0) // should scroll content to the very top
 * </pre>
 * @author Аверкиев П.А.
 */
export async function setScrollTop(
    element: ReturnType<WebdriverIO.Browser['$']>,
    value: number
): Promise<void> {
    await browser.execute(
        (px, scrollContent) => {
            scrollContent.scrollTop = px;
        },
        value,
        element
    );
}
