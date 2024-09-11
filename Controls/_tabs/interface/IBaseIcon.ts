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
     * @cfg {String} Название иконки.
     */
    icon?: string;
    /**
     * @cfg {String} Стиль отображения иконки.
     */
    iconStyle?: string;
    /**
     * @cfg {String} Размер иконки.
     */
    iconSize?: string;
    /**
     * @cfg {String} Отдельная всплывающая подсказка для иконки.
     */
    iconTooltip?: string;
}
