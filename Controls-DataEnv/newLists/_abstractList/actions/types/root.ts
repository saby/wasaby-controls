/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { TKey } from 'Controls/interface';

/**
 * Тип действия, для смены текущего корня иерархии.
 */
export type TSetRootAction = TAbstractAction<
    'setRoot',
    {
        root: TKey;
    }
>;
