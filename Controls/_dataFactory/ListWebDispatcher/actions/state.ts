/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from '../../interface/IListState';

export type TSetStateAction = TAbstractAction<
    'setState',
    {
        state: Partial<IListState>;
        applyStateStrategy?: 'internal' | 'immediate';
    }
>;

export const setState = (
    partialState: Partial<IListState>,
    applyStateStrategy: 'internal' | 'immediate' = 'internal'
): TSetStateAction => ({
    type: 'setState',
    payload: {
        state: partialState,
        applyStateStrategy,
    },
});

export type TRejectStateAction = TAbstractAction<'rejectSetState', Partial<IListState>>;

export const rejectSetState = (): TRejectStateAction => ({
    type: 'rejectSetState',
    payload: {},
});

export type TStateActions = TSetStateAction | TRejectStateAction;
