/**
 * Интерфейс для кастомного элемента из набора пометок.
 * @public
 */
export interface ICustomMarkElement {
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#id
     * @cfg {String|Number} Уникальный ключ элемента.
     */
    id: string | number;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#icon
     * @cfg {String} Название иконки.
     */
    icon: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#iconStyle
     * @cfg {String} Стиль иконки.
     */
    iconStyle?: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#iconSize
     * @cfg {String} Размер иконки.
     */
    iconSize?: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#caption
     * @cfg {String} Название пометки.
     */
    caption: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#iconClassName
     * @cfg {String} Класс иконки.
     */
    iconClassName?: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#tooltip
     * @cfg {String} Тултип пометки.
     */
    tooltip?: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#disabled
     * @cfg {String} Отключает возможность выбора и редактирования.
     */
    disabled?: boolean;
}
