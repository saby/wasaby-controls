/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
/**
 * Базовый интерфейс настройки для отображения иконки.
 * @class Controls/_tabs/interface/IBaseIcon
 * @public
 */
export interface IBaseIcon {
    /**
     * @name Controls/_tabs/interface/IBaseIcon#icon
     * @cfg {String} Название иконки.
     */
    icon?: string;
    /**
     * @name Controls/_tabs/interface/IBaseIcon#iconStyle
     * @cfg {String} Стиль отображения иконки.
     */
    iconStyle?: string;
    /**
     * @name Controls/_tabs/interface/IBaseIcon#iconSize
     * @cfg {String} Размер иконки.
     */
    iconSize?: string;
    /**
     * @name Controls/_tabs/interface/IBaseIcon#iconTooltip
     * @cfg {String} Отдельная всплывающая подсказка для иконки.
     */
    iconTooltip?: string;
}
