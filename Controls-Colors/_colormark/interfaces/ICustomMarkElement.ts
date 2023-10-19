/**
 * Интерфейс для кастомного элемента из набора пометок.
 * @public
 */
export interface ICustomMarkElement {
    /**
     * @name Controls-Colors/_colormark/interface/ICustomMarkElement#id
     * @cfg {String|Number} Уникальный ключ элемента.
     */
    id: string|number;
    /**
     * @name Controls-Colors/_colormark/interface/ICustomMarkElement#icon
     * @cfg {String} Название иконки.
     */
    icon: string;
    /**
     * @name Controls-Colors/_colormark/interface/ICustomMarkElement#iconStyle
     * @cfg {String} Стиль иконки.
     */
    iconStyle?: string;
    /**
     * @name Controls-Colors/_colormark/interface/ICustomMarkElement#iconSize
     * @cfg {String} Размер иконки.
     */
    iconSize?: string;
    /**
     * @name Controls-Colors/_colormark/interface/ICustomMarkElement#caption
     * @cfg {String} Название пометки.
     */
    caption: string;
}
