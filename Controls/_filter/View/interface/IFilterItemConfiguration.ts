/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

import { TViewMode } from './IFilterItem';

/**
 * Интерфейс конфигурации фильтра для сохранения
 * @public
 */
export interface IFilterItemConfiguration {
    /*
     * Имя фильтра
     */
    name: string;
    /*
     * Режим отображения фильтра.
     */
    viewMode: TViewMode;
    /*
     * Порядок фильтра, выбранный пользователем в конфигураторе.
     */
    order: number;
}
