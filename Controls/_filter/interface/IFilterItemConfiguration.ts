/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

import { TViewMode } from './IFilterDescriptionItem';
import { TFilterItemLocalName } from './IFilterItemLocal';

interface IFilterItemConfigurationInternal {
    /*
     * Имя фильтра
     */
    name: string;
    /*
     * Режим отображения фильтра.
     */
    viewMode?: TViewMode;
}

/**
 * Интерфейс конфигурации фильтра для сохранения
 * @private
 */
export type IFilterItemConfiguration = IFilterItemConfigurationInternal & {
    [key in TFilterItemLocalName]?: {
        viewMode?: TViewMode;
    };
};
