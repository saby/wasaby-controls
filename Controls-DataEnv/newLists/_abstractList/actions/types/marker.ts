/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { CrudEntityKey } from 'Types/source';

/**
 * Тип действия, для отметки записи маркером.
 */
export type TSetMarkedKeyAction = TAbstractAction<
    'setMarkedKey',
    {
        key: CrudEntityKey | null | undefined;
    }
>;
