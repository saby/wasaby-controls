/**
 * Элементы страницы Controls-demo/list_new/ItemsView/Base/Index
 * @author Зайцев А.С.
 */
export default class ItemsViewBasePage {
    addRowBase(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.demo-ListNewItemsViewBase__addRow');
    }

    delRowBase(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.demo-ListNewItemsViewBase__delRow');
    }
}
