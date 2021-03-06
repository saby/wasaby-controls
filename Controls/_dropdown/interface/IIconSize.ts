export interface IIconSizeOptions {
   /**
    * @name Controls/_dropdown/interface/IIconSize#iconSize
    * @cfg {IconSize} Единый размер для иконок, отображаемых в контроле.
    * @default default
    * @variant s Маленькая.
    * @variant m Средняя.
    * @variant l Большая.
    * @variant default По умолчанию.
    * @remark
    * Иконки могут отображаться внутри вызывающего элемента (см. {@link Controls/dropdown:Button#icon icon}) и внутри элементов выпадающего списка (см. {@link  Controls/dropdown:Button#itemTemplate itemTemplate}).
    * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
    * @example
    * @see Icon
    */
   iconSize?: string;
}

/**
 * Интерфейс для выпадающих списков, поддерживающих настройку размера иконок.
 * @interface Controls/_dropdown/interface/IIconSize
 * @public
 * @author Герасимов А.М.
 */
export default interface IIconSize {
   readonly '[Controls/_dropdown/interface/IIconSize]': boolean;
}