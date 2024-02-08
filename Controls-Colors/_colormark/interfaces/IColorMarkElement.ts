/**
 * Интерфейс для базового элемента из набора пометок.
 * @public
 */
export interface IColorMarkElement {
    /**
     * @name Controls-Colors/_colormark/interfaces/IColorMarkElement#id
     * @cfg {String|Number} Уникальный ключ элемента.
     */
    id: string|number;
    /**
     * @name Controls-Colors/_colormark/interfaces/IColorMarkElement#type
     * @cfg {String} Тип элемента.
     * @variant color
     * @variant style
     * @default color
     * @demo Controls-Colors-demo/Panel/Index
     * @remark Установим для первого элемента type=style
     */
    type?: 'color' | 'style';
    /**
     * @name Controls-Colors/_colormark/interfaces/IColorMarkElement#value
     * @cfg {Controls-Colors/_colormark/interfaces/IColorMarkElement/TValue.typedef} Объект значений цвета и дополнительных настроек.
     * @demo Controls-Colors-demo/Panel/Index
     */
    value: {
        color: string;
        style?: {
            b: boolean;
            i: boolean;
            u: boolean;
            s: boolean;
        }
    };
    /**
     * @name Controls-Colors/_colormark/interface/IColorMarkElement#caption
     * @cfg {String} Название пометки.
     */
    caption: string;
    /**
     * @name Controls-Colors/_colormark/interfaces/IColorMarkElement#removable
     * @cfg {Boolean} Возможность удалить.
     * @demo Controls-Colors-demo/Panel/ItemActions/Index
     * @remark Запретим удаление последней записи в списке.
     */
    removable?: boolean;
    /**
     * @name Controls-Colors/_colormark/interfaces/IColorMarkElement#editable
     * @cfg {Boolean} Возможность редактировать.
     * @demo Controls-Colors-demo/Panel/ItemActions/Index
     * @remark Запретим редактирование первой записи в списке.
     */
    editable?: boolean;
}

/**
 * @typedef {Object} Controls-Colors/_colormark/interfaces/IColorMarkElement/TValue
 * @property {String} color Цвет в веб формате или имя css переменной.
 * @property {Controls-Colors/_colormark/interface/IColorMarkElement/TStyle.typedef} style Стилизация пометки в style режиме.
 */

/**
 * @typedef {Object} Controls-Colors/_colormark/interfaces/IColorMarkElement/TStyle
 * @property {Boolean} b Жирность
 * @property {Boolean} i Курсив
 * @property {Boolean} u Подчеркнутость
 * @property {Boolean} s Зачеркнутость
 */
