/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { showType as ShowType } from 'Controls/toolbars';
import { IButtonOptions } from 'Controls/buttons';
import { TActionViewMode } from 'Controls/interface';

/**
 * Допустимые значения для опции {@link displayMode}.
 * @typedef TActionDisplayMode
 * @variant title показывать только заголовок
 * @variant icon показывать только иконку
 * @variant both показывать иконку и заголовок
 * @variant auto если есть иконка, то показывать иконку, иначе заголовок
 */
export type TActionDisplayMode = 'title' | 'icon' | 'both' | 'auto' | string;

/**
 * Конфигурация кнопки тулбара
 * @public
 */
export interface IActionButtonConfig
    extends Pick<
        IButtonOptions,
        'iconStyle' | 'buttonStyle' | 'icon' | 'iconSize' | 'inlineHeight' | 'fontColorStyle'
    > {
    viewMode?: TActionViewMode;
}

/**
 * Конфигурация любого экшна.
 * Всегда передаётся в конструктор экшна, будь то BaseAction или конструктор, указанный в actionName
 * @public
 */
export interface IActionCommonConfig extends IActionButtonConfig {
    /**
     * Идентификатор экшена
     * @cfg
     */
    id?: string;
    /**
     * Видимость экшена по умолчанию.
     * @cfg
     * @default true
     */
    visible?: boolean;
    /**
     * Определяет, где будет отображаться action.
     * @default MENU_TOOLBAR
     * @cfg
     */
    showType?: ShowType;
    /**
     * Иконка, отображаемая в меню
     * @cfg
     */
    menuIcon?: string;
    /**
     * Название экшена. Будет отображено у кнопки и в меню.
     * @cfg
     */
    title?: string;
    /**
     * Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
     * @cfg
     */
    tooltip?: string;
    /**
     * Признак, является ли пункт "Дополнительным"
     * @cfg
     */
    additional?: boolean;
    /**
     * Группа для отображения
     * @cfg
     */
    group?: string;
    /**
     * Порядок отображения экшена.
     * @cfg
     */
    order?: number;
    /**
     * Флаг "только для чтения". Если true, то действие нельзя выполнить.
     * @cfg
     */
    readOnly?: boolean;
    /**
     * Режим отображения - с иконкой, с текстом или без.
     * @cfg
     */
    displayMode?: TActionDisplayMode;
}

/**
 * Интерфейс публичных свойств экшена
 * @public
 */
export interface IActionProps extends IActionCommonConfig {
    template?: string | Function;
    templateOptions?: object;
    caption?: string;
}
