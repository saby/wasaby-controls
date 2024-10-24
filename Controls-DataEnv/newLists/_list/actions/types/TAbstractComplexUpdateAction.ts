/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IListState } from '../../interface/IListState';

/**
 * Абстрактный тип действия, для формирования типов действий комплексного обновления состояния.
 */
export type TAbstractComplexUpdateAction<TMiddlewareName extends string> = TAbstractAction<
    `complexUpdate${TMiddlewareName}`,
    {
        nextState: IListState;
        prevState: IListState;
    }
>;
