export const DEFAULT_ACTION_ALIGNMENT = 'horizontal';

export const DEFAULT_ACTION_CAPTION_POSITION = 'none';

export const DEFAULT_ACTION_POSITION = 'inside';

export const DEFAULT_ACTION_SIZE = 'm';

export const DEFAULT_ACTION_MODE = 'strict';

// Стиль цвета иконки в кнопке по умолчанию
export const DEFAULT_ICON_STYLE = 'secondary';

// Стиль цвета кнопки по умолчанию
export const DEFAULT_BUTTON_STYLE = 'secondary';

// Стиль цвета функциональной (круглой) кнопки по умолчанию
export const DEFAULT_FUNCTIONAL_BUTTON_STYLE = 'pale';

export const EDITING_APPLY_BUTTON_KEY = 'controls-default-editing-apply-action';

export const EDITING_CLOSE_BUTTON_KEY = 'controls-default-editing-close-action';

/**
 * @typedef {String} Controls/itemActions/TItemActionShowType
 * @description
 * Позволяет настроить, какие опции записи будут показаны по ховеру, а какие - в доп.меню.
 * Влияет на порядок отображения опций записи по свайпу.
 * Экспортируемый enum: Controls/itemActions:TItemActionShowType
 * @variant MENU показывать кнопку операции только в дополнительном меню
 * @variant MENU_TOOLBAR показывать кнопку операции в дополнительном меню и тулбаре
 * @variant TOOLBAR показывать кнопку операции только в тулбаре
 * @variant FIXED Показывать кнопку операции в фиксированном положении или перед кнопкой меню.
 * Для зафиксированной таким образом операций над записью iconStyle, указанный в её настройках всегда имеет наибольший
 * приоритет.
 */
export enum TItemActionShowType {
    // show only in Menu
    MENU,
    // show in Menu and Toolbar
    MENU_TOOLBAR,
    // show only in Toolbar
    TOOLBAR,
    // fixed position
    FIXED,
}

/**
 * @typedef {String} Controls/itemActions/TActionDisplayMode
 * @description
 * Допустимые значения для опции {@link displayMode}.
 * Экспортируемый enum: Controls/itemActions:TActionDisplayMode
 * @variant TITLE показывать только заголовок
 * @variant ICON показывать только иконку
 * @variant BOTH показывать иконку и заголовок
 * @variant AUTO если есть иконка, то показывать иконку, иначе заголовок
 */
export enum TActionDisplayMode {
    TITLE = 'title',
    ICON = 'icon',
    BOTH = 'both',
    AUTO = 'auto',
}
