import type { TKey } from 'Controls-DataEnv/interface';
import type { TVisibility as TBaseVisibility } from 'Controls-DataEnv/listTypes';

/**
 * Режимы отображения маркера.
 */
export type TVisibility = Extract<TBaseVisibility, 'visible' | 'hidden'> | 'onactivated';

/**
 * Интерфейс состояния для работы с маркером в списке с любым типом интерактора(web/mobile).
 */
export interface IMarkerState {
    markerVisibility?: TVisibility;
    markedKey?: TKey;
}
