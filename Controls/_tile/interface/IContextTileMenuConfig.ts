/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

import { IContextMenuConfig } from 'Controls/itemActions';
import { TemplateFunction } from 'UICommon/Base';

/**
 * Интерфейс конфигурации для меню опций плитки.
 * @public
 */
export interface IContextTileMenuConfig extends IContextMenuConfig {
    /**
     * @cfg {string} Свойство записи для вывода дополнительного текста.
     */
    headerAdditionalTextProperty?: string;
    /**
     * @cfg {string} Опция для вывода шаблона справа от дополнительного текста.
     */
    additionalTitleInfoTemplate?: TemplateFunction;
}
