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
