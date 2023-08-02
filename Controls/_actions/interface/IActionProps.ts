/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
/**
 * Интерфейс публичных свойств экшена
 * @interface Controls/_actions/interface/IActionProps
 * @public
 */

/**
 * @typedef {String} TItemActionShowType
 * @description
 * Позволяет настроить, какие опции записи будут показаны в быстром доступе а какие - в меню.
 * @variant MENU показывать кнопку операции только в меню
 * @variant MENU_TOOLBAR показывать кнопку операции в меню и тулбаре
 * @variant TOOLBAR показывать кнопку операции только в тулбаре
 */

/**
 * @typedef {String} TPermissionsMode
 * @description
 * Режим проверки прав. Через И или ИЛИ
 * @variant 0 Проверка прав через И
 * @variant 1 Проверка прав через ИЛИ
 */

/**
 * @name Controls/_actions/interface/IActionProps#id
 * @cfg {string} Идентификатор экшена
 */

/**
 * @name Controls/_actions/interface/IActionProps#title
 * @cfg {string} Название экшена. Будет отображено у кнопки и в меню.
 */

/**
 * @name Controls/_actions/interface/IActionProps#tooltip
 * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
 */

/**
 * @name Controls/_actions/interface/IActionProps#icon
 * @cfg {string} Иконка
 */

/**
 * @name Controls/_actions/interface/IActionProps#iconStyle
 * @cfg {string} Стиль иконки
 */

/**
 * @name Controls/_actions/interface/IActionProps#viewMode
 * @cfg {string} Режим отображения кнопки
 */

/**
 * @name Controls/_actions/interface/IActionProps#buttonStyle
 * @cfg {string} Стиль отображения кнопки
 */

/**
 * @name Controls/_actions/interface/IActionProps#additional
 * @cfg {boolean} Признак, является ли пункт "Дополнительным"
 */

/**
 * @name Controls/_actions/interface/IActionProps#group
 * @cfg {string} Группа для отображения
 */

/**
 * @name Controls/_actions/interface/IActionProps#showType
 * @default MENU_TOOLBAR
 * @cfg {TItemActionShowType} Определяет, где будет отображаться action.
 */

/**
 * @name Controls/_actions/interface/IActionProps#visible
 * @cfg {boolean} Видимость экшена по умолчанию.
 * @default true
 */

export interface IActionProps {
    readonly id: string;
    iconStyle?: string;
    viewMode?: string;
    buttonStyle?: string;
    visible?: boolean;
    template?: string | Function;
    templateOptions?: object;
    showType?: number;
    icon?: string;
    title?: string;
    tooltip?: string;
    iconSize?: string;
    additional?: boolean;
    group?: string;
}
