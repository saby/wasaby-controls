import type { IFilterItem } from 'Controls/filter';
import type { TFilter } from 'Controls-DataEnv/interface';

/**
 * Интерфейс состояния для работы с фильтрами и окнами фильтров в списке с любым типом интерактора(web/mobile).
 */
export interface IFilterState {
    filter?: TFilter;
    filterDetailPanelVisible: boolean;
    /**
     * Элементы структуры фильтров.
     */
    filterDescription?: IFilterItem[];
}
