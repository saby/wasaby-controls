/**
 * Элементы страницы Controls-demo/list_new/Grouped/OnGroupCollapsed/Index
 * @author Зайцев А.С.
 */
export default class OnGroupCollapsedPage {
    clickMessage(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="controlsDemo_OnGroupCollapsed__click-message"]');
    }
}
