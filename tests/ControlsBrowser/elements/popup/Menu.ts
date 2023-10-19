import BaseElement from '../BaseElement';
import BaseList, { ItemSelector } from '../BaseList';

/**
 * Меню.
 * @author Зайцев А.С.
 */
export default class Menu extends BaseElement {
    private _itemsList: BaseList;
    constructor(selector: string = '.controls-Menu__popup') {
        super(selector);
        this._itemsList = new BaseList('data-qa="item"');
    }

    head(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.controls-Menu__popup-template .controls-Menu__popup-header');
    }

    item(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        return this._itemsList.item(selector);
    }

    items(): ReturnType<WebdriverIO.Browser['$$']> {
        return this._itemsList.items();
    }

    crossButton(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="controls-stack-Button__close"]');
    }

    async select(selector: ItemSelector): Promise<void> {
        await this.item(selector).click();
    }

    async close(): Promise<void> {
        await this.crossButton().click();
    }
}

function getItem(this: Element): Element {
    /*
    эта функция выполняется в контексте браузера, а не в контексте тестов.
    Иными словами - всё, что использует эта функция, должно объявляться внутри неё.
     */
    return this.closest('[data-qa="item"]');
}
