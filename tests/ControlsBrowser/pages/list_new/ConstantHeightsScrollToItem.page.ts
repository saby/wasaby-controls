/**
 * Элементы страницы Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/Index
 * @author Аверкиев П.А.
 */
export default class ConstantHeightsScrollToItemPage {
    scrollToSeventhRecord(): Promise<void> {
        return $("//*[.='Проскролить к записи с id=7']").click();
    }
}
