export type ItemSelector =
    | {
          /**
           * Номер элемента, нумерация с 1.
           */
          index: number;
      }
    | {
          /**
           * Точный текст, который должен быть внутри элемента.
           */
          text: string;
      }
    | {
          /**
           * Кусок текста, который должен быть внутри элемента. Регистр важен.
           */
          textContaining: string;
      };

/**
 * Класс для работы с элементами любого списка.
 * @author Зайцев А.С.
 */
export default class BaseList {
    private readonly _itemSelector: string;

    constructor(selector: string) {
        this._itemSelector = selector;
    }

    item(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        if ('index' in selector) {
            // @ts-expect-error Пока не знаю какой тип здесь правильнее указать.
            return this.items()[selector.index - 1];
        }
        if ('text' in selector) {
            return $(
                `//*[@${this._itemSelector}][descendant-or-self::*[text()="${selector.text}"]]`
            );
        }
        if ('textContaining' in selector) {
            return $(
                `//*[@${this._itemSelector}][descendant-or-self::*[contains(text(),'${selector.textContaining}')]]`
            );
        }
    }

    items(): ReturnType<WebdriverIO.Browser['$$']> {
        return $$(`[${this._itemSelector}]`);
    }
}
