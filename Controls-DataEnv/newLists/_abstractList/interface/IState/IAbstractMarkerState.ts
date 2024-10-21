/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls-DataEnv/interface';
import type { TVisibility as TBaseVisibility } from 'Controls/interface';

/**
 * Режимы отображения маркера.
 */
export type TVisibility = Extract<TBaseVisibility, 'visible' | 'hidden'> | 'onactivated';

/**
 * Интерфейс состояния для работы с маркером.
 */
export interface IAbstractMarkerState {
    markerVisibility?: TVisibility;
    markedKey?: TKey;
}
