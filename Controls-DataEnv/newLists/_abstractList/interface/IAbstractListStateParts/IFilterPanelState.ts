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

    /**
     * Выбранное значение {@link Controls-ListEnv/CountFilter фильтра по счетчикам}.
     */
    countFilterValue?: string | Date[];

    /**
     * Связные фильтры для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}. При изменении выбранного значения контрола "Фильтр по счетчикам" у этих фильтров будет изменено поле filter.
     */
    countFilterLinkedNames?: string[];

    /**
     * Функция обратного вызова для получения значения фильтра после выбора из {@link Controls-ListEnv/CountFilter фильтра по счетчикам}.
     * Данную функцию необходимо использовать в случае, если значение поставляемое контролом
     * по каким то причинам не подходит для запроса к источнику данных. Например, метод БЛ
     * не поддерживает фильтрацию по массиву дат и ожидает значения в двух полях фильтра.
     */
    countFilterValueConverter?: (
        value: string | Date | Date[],
        filterItem: IFilterDescriptionItem,
        filterDescription: IFilterDescriptionItem[]
    ) => QueryWhereExpression<unknown>;

    /**
     * Пользовательские периоды для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}, будут добавлены как пункты меню.
     * Для каждого пользовательского периода необходимо задать функцию получения периода getValueFunctionName
     */
    countFilterUserPeriods?: IUserPeriod[];

    /**
     * Тип выбираемого периода для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}
     * @variant current за текущий период
     * @variant last за последний период
     */
    countFilterPeriodType?: string;
}
