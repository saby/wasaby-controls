/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

/**
 * @typedef {String} Controls/_tile/interface/TContainerVerticalPaddingSize
 * @description Допустимые значения для внешнего отступа контейнера контрола.
 * @variant null
 * @variant default
 */
export type TContainerVerticalPaddingSize = 'null' | 'default';

/**
 * @typedef {String} Controls/_tile/interface/TContainerHorizontalPaddingSize
 * @description Допустимые значения для внешнего отступа контейнера контрола.
 * @variant null
 * @variant default
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 */
export type TContainerHorizontalPaddingSize =
    | 'null'
    | 'default'
    | 'xs'
    | 's'
    | 'm'
    | 'l'
    | 'xl'
    | '2xl'
    | '3xl';

/**
 * Интерфейс настройки внешнего отступа контейнера контрола.
 * @interface Controls/_tile/interface/IItemsContainerPadding
 * @public
 */
export interface IItemsContainerPadding {
    /**
     * @name Controls/_tile/interface/IItemsContainerPadding#top
     * @cfg {Controls/_tile/interface/TContainerVerticalPaddingSize} Отступ контейнера сверху
     */
    top?: TContainerVerticalPaddingSize;
    /**
     * @name Controls/_tile/interface/IItemsContainerPadding#bottom
     * @cfg {Controls/_tile/interface/TContainerVerticalPaddingSize} Отступ контейнера снизу
     */
    bottom?: TContainerVerticalPaddingSize;
    /**
     * @name Controls/_tile/interface/IItemsContainerPadding#left
     * @cfg {Controls/_tile/interface/TContainerHorizontalPaddingSize} Отступ контейнера слева
     */
    left?: TContainerHorizontalPaddingSize;
    /**
     * @name Controls/_tile/interface/IItemsContainerPadding#right
     * @cfg {Controls/_tile/interface/TContainerHorizontalPaddingSize} Отступ контейнера справа
     */
    right?: TContainerHorizontalPaddingSize;
}
