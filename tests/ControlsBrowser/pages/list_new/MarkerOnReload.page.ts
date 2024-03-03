/**
 * Элементы страницы Controls-demo/list_new/Marker/OnReload/Index
 * @author Зайцев А.С.
 */
export default class MarkerOnReloadPage {
    reloadListLink(): ReturnType<WebdriverIO.Browser['$']> {
        return $('a[href="#"]');
    }

    reloadResultText(): ReturnType<WebdriverIO.Browser['$']> {
        return $('p');
    }
}
