import type { TSortingOptionValue } from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы с сортировкой в списке с любым типом интерактора(web/mobile).
 */
export interface ISortingState {
    sorting?: TSortingOptionValue;
}
