import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import type { TKey } from 'Controls/interface';

export type TSetRootAction = TAbstractAction<
    'setRoot',
    {
        root?: TKey;
    }
>;

export const setRoot = (root: TKey | undefined): TSetRootAction => ({
    type: 'setRoot',
    payload: {
        root,
    },
});

export type TComplexUpdateRootAction = TAbstractAction<
    'complexUpdateRoot',
    {
        prevState: IListState;
        root?: TKey;
    }
>;

export const complexUpdateRoot = (
    prevState: IListState,
    root: TKey | undefined
): TComplexUpdateRootAction => ({
    type: 'complexUpdateRoot',
    payload: {
        prevState,
        root,
    },
});

export type TRootActions = TSetRootAction | TComplexUpdateRootAction;
