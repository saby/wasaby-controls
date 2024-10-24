/**
 * Список общих элементов.
 * @author Зайцев А.С.
 */
export default class Common {
    static globalIndicator(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="indicator_state_loading_position_global"]');
    }

    static topIndicator(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="indicator_state_loading_position_top"]');
    }

    static bottomIndicator(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="indicator_state_loading_position_bottom"]');
    }

    static continueSearchBottomIndicator(): ReturnType<WebdriverIO.Browser['$']> {
        return $('[data-qa="indicator_state_continue-search_position_bottom"]');
    }
}
