import { TKey } from './UtilityTypes';

/**
 * Интерфейс объекта, содержащего выделение в списке
 * @public
 */
export interface ISelection {
    /**
     *
     */
    selected: TKey[];
    /**
     *
     */
    excluded: TKey[];
}
