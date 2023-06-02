/**
 * Элементы страницы Controls-demo/list_new/ItemActions/ItemActionClickHandler/Index
 * @author Зайцев А.С.
 */
export default class ItemActionClickHandlerPage {
    result(): ReturnType<WebdriverIO.Browser['$']> {
        return $(
            '#newListView .controlsDemo__wrapper:not(.controlsDemo__pt-none)'
        );
    }
}
