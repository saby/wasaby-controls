/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { IFilterItem } from '../View/interface/IFilterItem';

/**
 * Тип структуры фильтров.
 * @cfg
 *
 * @public
 */
export type TFilterDescription = IFilterItem[];

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
