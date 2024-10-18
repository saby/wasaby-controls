import BaseElement from '../BaseElement';

/**
 * Постраничная навигация.
 * @author Зайцев А.С.
 */
export default class Paging extends BaseElement {
    constructor(selector: string = '.controls-PagingV') {
        super(selector);
    }

    next(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="Paging__Next"]');
    }

    prev(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="Paging__Prev"]');
    }

    begin(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="Paging__Begin"]');
    }
}
