/**
 * Базовый класс для контролов. Пока нужен только для того, чтобы унифицировать обращения к контейнеру.
 */
export default class BaseElement {
    private readonly _selector: string;

    constructor(selector: string) {
        this._selector = selector;
    }

    container(): ReturnType<WebdriverIO.Browser['$']> {
        return $(this._selector);
    }
}
