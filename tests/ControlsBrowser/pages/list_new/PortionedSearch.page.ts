/**
 * Элементы страницы Controls-demo/list_new/Searching/PortionedSearchMocked/Index
 * @author Зайцев А.С.
 */
export default class PortionedSearchPage {
    continueFiveRecords(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="return-five-and-continue"]');
    }

    abortSearch(): ReturnType<WebdriverIO.Browser['$']> {
        return $("//*[.='Прервать поиск']");
    }
}
