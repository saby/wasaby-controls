/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { TemplateFunction } from 'UI/Base';
import { IMenuPopupOptions } from 'Controls/menu';
import { TIconSize } from 'Controls/interface';

/**
 * Интерфейс конфигурации для меню опции записи.
 * @remark
 * Набор опций передается объектом. Заданный объект мержится с минимальным объектом опций, отдаваемых в меню по-умолчанию.
 * @extends Controls/_menu/interface/IMenuBase
 * @public
 */
export interface IContextMenuConfig extends IMenuPopupOptions {
    /**
     * @cfg {UI/Base:TemplateFunction|string} Шаблон для установки группировки.
     */
    groupTemplate?: TemplateFunction;
    /**
     * @cfg {string} Свойство записи для установки группировки.
     */
    groupProperty?: string;
    /**
     * @cfg {UI/Base:TemplateFunction|string} Шаблон элемента меню.
     */
    itemTemplate?: TemplateFunction | string;
    /**
     * @cfg {UI/Base:TemplateFunction|string} Шаблон футера.
     */
    footerTemplate?: TemplateFunction | string;
    /**
     * @cfg {UI/Base:TemplateFunction|string} Шаблон шапки.
     */
    headerTemplate?: TemplateFunction | string;
    /**
     * @cfg {Controls/interface:TIconSize} Размер иконок в выпадающем меню.
     */
    iconSize?: TIconSize;
    /**
     * @cfg {string} Свойство записи для вывода в дополнительного текста.
     */
    headerAdditionalTextProperty?: string;
}
