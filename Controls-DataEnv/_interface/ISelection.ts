import { TKey } from './UtilityTypes';

/**
 * Интерфейс объекта, содержащего выделение в списке
 */
export interface ISelection {
    selected: TKey[];
    excluded: TKey[];
}
