/**
 * Элементы страницы Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Index
 * @author Зайцев А.С.
 */
export default class VirtualScrollContainerPage {
    listTopBlock(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="ControlsDemo-VisualScrollContainer__top"]');
    }
    listBottomBlock(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="ControlsDemo-VisualScrollContainer__bottom"]');
    }
}
