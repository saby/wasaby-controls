/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';
import type { IFooterConfig } from 'Controls/gridRender';

/**
 * Интерфейс конфигурации ячейки подвала таблицы
 * @private
 */
export interface IFooter {
    template?: TemplateFunction;
    startColumn?: number;
    endColumn?: number;
}

export type TFooter = (IFooter | IFooterConfig)[];
