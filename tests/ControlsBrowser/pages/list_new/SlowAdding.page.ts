/**
 * Элементы страницы Controls-demo/list_new/EditInPlace/SlowAdding/Index
 * @author Зайцев А.С.
 */
export default class SlowAddingPage {
    addRecord(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="controls-AddButton"]');
    }
}
