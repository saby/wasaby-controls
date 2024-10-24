import { ITooltip } from 'Controls/interface';
import IPartialSelected from './IPartialSelected';
/**
 * Интерфейс для кастомного элемента из набора пометок.
 * @implements Controls/interface:ITooltip
 * @public
 */
export interface ICustomMarkElement extends ITooltip, IPartialSelected {
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
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#disabled
     * @cfg {String} Отключает возможность выбора и редактирования.
     */
    disabled?: boolean;
    /**
     * @name Controls-Colors/_colormark/interfaces/ICustomMarkElement#editableStyle
     * @cfg {Boolean} Возможность редактировать цвет.
     * @default true
     * @demo Controls-Colors-demo/Panel/ItemActions/Index
     * @remark Запретим редактирование цвета второй записи в списке.
     */
    editableStyle?: boolean;
}
