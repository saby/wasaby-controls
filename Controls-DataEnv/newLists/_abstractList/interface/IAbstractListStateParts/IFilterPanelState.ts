import type { IUserPeriod } from 'Controls-DataEnv/listTypes';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import type { QueryWhereExpression } from 'Types/source';
import type { IFilterBaseState } from './IFilterState';

/**
 * Интерфейс состояния для работы с окнами фильтров в списке с любым типом интерактора(web/mobile).
 */
export interface IFilterPanelState extends IFilterBaseState {
    /**
     * Флаг, определяющий, открыта ли в данный момент панель фильтров, связанная с данным слайсом списка.
     */
    filterDetailPanelVisible: boolean;
    /**
     * Элементы структуры фильтров.
     */
    filterDescription?: IFilterDescriptionItem[];
    countFilterValue?: string | Date[];
    countFilterLinkedNames?: string[];
    countFilterValueConverter?: (
        value: string | Date | Date[],
        filterItem: IFilterDescriptionItem,
        filterDescription: IFilterDescriptionItem[]
    ) => QueryWhereExpression<unknown>;
    countFilterUserPeriods?: IUserPeriod[];
    countFilterPeriodType?: string;
}
