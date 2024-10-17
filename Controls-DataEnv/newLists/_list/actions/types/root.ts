/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls/interface';

export type TSetRootAction = TAbstractListActions.root.TSetRootAction;

export type TComplexUpdateRootAction = TAbstractAction<
    'complexUpdateRoot',
    {
        prevState: IListState;
        root?: TKey;
    }
>;
