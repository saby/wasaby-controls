/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
import IFilterSourceItem from 'Controls/_filter/interface/IFilterSourceItemOld';

/**
 * Тип структуры фильтров.
 * @cfg
 *
 * @public
 */
// IFilterSourceItem - для совместимости, чтобы не ломались прикладные сборки
export type TFilterDescription = IFilterItem[] | IFilterSourceItem[];

/**
 * Интерфейс для контролов, которые поддерживают структуру фильтров.
 *
 * @public
 */
export interface IFilterDescriptionProps {
    /**
     * Структура фильтров.
     */
    filterDescription: TFilterDescription;
}
