/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TPaddingSize } from 'Controls/interface';

/**
 * Допустимые значения для свойств {@link Controls/interface:IItemPadding/IPadding.typedef ItemPadding}.
 * @typedef {String} Controls/_interface/IItemPadding/TVerticalItemPadding
 * @variant null Нулевой отступ. Значение передается строкой.
 * @variant s Маленький отступ.
 * @variant default Отступ по умолчанию (большой).
 */
export type TVerticalItemPadding = 'S' | 'null' | 'default';

/**
 * Допустимые значения для свойств {@link Controls/interface:IItemPadding/IPadding.typedef ItemPadding}.
 * См. {@link http://axure.tensor.ru/StandardsV8/%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5.html Глобальные переменные}
 * @typedef {String} Controls/_interface/IItemPadding/THorizontalItemPadding
 * @variant null Нулевой отступ. Значение передается строкой.
 * @variant xs Минимальный отступ.
 * @variant s Маленький отступ.
 * @variant m Средний отступ.
 * @variant l Большой отступ.
 * @variant xl Очень большой оступ.
 * @variant xxl Максимальный отступ.
 */
export type THorizontalItemPadding = TPaddingSize;

/**
 * Интерфейс настройки отступов записи
 * @interface Controls/_interface/IItemPadding/IPadding
 * @public
 */
export interface IPadding {
    /**
     * @name Controls/_interface/IItemPadding/IPadding#top
     * @cfg {Controls/_interface/IItemPadding/TVerticalItemPadding.typedef} Отступ от содержимого до верхней границы элемента. Если свойство принимает значение null, то отступ отсутствует.
     */
    top?: TVerticalItemPadding;
    /**
     * @name Controls/_interface/IItemPadding/IPadding#bottom
     * @cfg {Controls/_interface/IItemPadding/TVerticalItemPadding.typedef} Отступ от содержимого до нижней границы элемента. Если свойство принимает значение null, то отступ отсутствует.
     */
    bottom?: TVerticalItemPadding;
    /**
     * @name Controls/_interface/IItemPadding/IPadding#left
     * @cfg {Controls/_interface/IItemPadding/THorizontalItemPadding.typedef} Отступ от содержимого до левой границы элемента. Если свойство принимает значение null, то отступ отсутствует.
     */
    left?: TPaddingSize;
    /**
     * @name Controls/_interface/IItemPadding/IPadding#right
     * @cfg {Controls/_interface/IItemPadding/THorizontalItemPadding.typedef} Отступ от содержимого до правой границы элемента. Если свойство принимает значение null, то отступ отсутствует.
     */
    right?: TPaddingSize;
}

export interface IItemPaddingOptions {
    itemPadding?: IPadding;
}
/**
 * Интерфейс для контролов, поддерживающих установку внутренних отступов для элементов
 * @public
 */
export default interface IItemPadding {
    readonly '[Controls/_interface/IItemPadding]': boolean;
}

/**
 * Конфигурация отступов внутри элементов списка.
 * @name Controls/_interface/IItemPadding#itemPadding
 * @cfg {Controls/_interface/IItemPadding/IPadding}
 * @demo Controls-demo/gridNew/ItemPaddingNull/Index
 * @remark Во избежание наслаивания текста на маркер, для списков со style='master' менять горизонтальный отступ не рекомендуется.
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/list/paddings/ руководство разработчика}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA.html спецификация Axure}
 */
