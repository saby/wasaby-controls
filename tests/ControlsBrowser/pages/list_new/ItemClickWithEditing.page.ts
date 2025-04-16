/**
 * Элементы страницы Controls-demo/list_new/ItemClick/WithEditing/Index
 * @author Зайцев А.С.
 */
export default class ItemClickWithEditingPage {
    hiddenInfo(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="controlsDemo-ItemClickWithEditing__textInfo"]');
    }

    multiselect(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="controlsDemo-ItemClickWithEditing__multiSelect"]');
    }

    async checkHiddenInfo(): Promise<void> {
        // Для возможного срабатывания события
        await browser.pause(500);
        await expect(this.hiddenInfo()).not.toBeDisplayed();
    }
}
