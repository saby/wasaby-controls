/**
 * Элементы страницы Controls-demo/list_new/ItemClick/Base/Index
 * @author Зайцев А.С.
 */
export default class ItemClickBasePage {
    eventsLogPanel(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.controlsDemo-toolbar-panel');
    }
}
