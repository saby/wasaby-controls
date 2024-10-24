/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TFilter } from 'Controls-DataEnv/interface';
import type { IListState } from '../../interface/IListState';
import type { IFilterItem, IUserPeriod } from 'Controls/filter';
import type { QueryWhereExpression } from 'Types/source';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

// FIXME: Убрать этот тип. Минимум - из export, максимум - вообще.
/**
 * IFilterState
 */
export interface IFilterState {
    filter?: TFilter;
    filterDescription?: IFilterItem[];
    countFilterValue?: string | Date[];
    countFilterLinkedNames?: string[];
    countFilterValueConverter?: (
        value: string | Date | Date[],
        filterItem: IFilterItem,
        filterDescription: IFilterItem[]
    ) => QueryWhereExpression<unknown>;
    countFilterUserPeriods?: IUserPeriod[];
    countFilterPeriodType?: string;
}

//# region Экспорты для публичных типов.
/**
 * Тип действия, для установки нового фильтра.
 */
export type TSetFilterAction = TAbstractListActions.filter.TSetFilterAction;
/**
 * Тип действия для открытия окон фильтров.
 */
export type TOpenFilterDetailPanelAction = TAbstractListActions.filter.TOpenFilterDetailPanelAction;
/**
 * Тип действия для закрытия окон фильтров.
 */
export type TCloseFilterDetailPanelAction =
    TAbstractListActions.filter.TCloseFilterDetailPanelAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия, для установки структуры фильтров.
 */
export type TSetFilterDescriptionAction = TAbstractAction<
    'setFilterDescription',
    Pick<
        IFilterState,
        | 'filterDescription'
        | 'countFilterValue'
        | 'countFilterLinkedNames'
        | 'countFilterValueConverter'
        | 'countFilterUserPeriods'
        | 'countFilterPeriodType'
    >
>;

/**
 * Тип действия, для обновления фильтра.
 */
export type TUpdateFilterAction = TAbstractAction<
    'updateFilter',
    {
        prevState: IListState;
    } & IFilterState
>;

/**
 * Тип действий функционала "Фильтрация", доступные в WEB списке.
 * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
 */
export type TAnyFilterAction =
    | TAbstractListActions.filter.TAnyFilterAction
    | TSetFilterDescriptionAction
    | TUpdateFilterAction;
