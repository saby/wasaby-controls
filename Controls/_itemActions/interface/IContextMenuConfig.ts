/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
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
    eventHandlers?: object;
}
