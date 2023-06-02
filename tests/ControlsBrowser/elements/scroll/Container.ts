import BaseElement from '../BaseElement';

/**
 * Скролл-контейнер.
 * @author Зайцев А.С.
 */
export default class Scroll extends BaseElement {
    constructor(selector: string = '.controls-Scroll') {
        super(selector);
    }

    content(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="controls-Scroll__content"]');
    }

    shadow(
        position: 'top' | 'bottom' | 'left' | 'right'
    ): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$(`[data-qa="Scroll__shadow_${position}"]`);
    }

    trigger(position: 'top' | 'bottom'): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$(`[data-qa="loading-trigger-${position}"]`);
    }
}
