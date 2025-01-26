/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';

import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import {
    AbstractListSlice as DataAbstractListSlice,
    TAbstractListActions,
    IAbstractListState,
    TAbstractListMiddlewareContext,
} from 'Controls-DataEnv/abstractList';
import { getFilterModuleSync } from './utils/getFilterModuleSync';
import type { IFilterItem } from 'Controls/filter';
import { calculateFilterByFilterDescription } from './utils/calculateFilterByFilterDescription';

export { IAbstractListSliceState };

export abstract class AbstractListSlice<
    TState extends IAbstractListState,
    TAction extends TAbstractListActions.TAnyAbstractListAction<TState> | TAbstractAction,
    TMiddlewareContext extends TAbstractListMiddlewareContext<TState, TAction>,
> extends DataAbstractListSlice<TState, TAction, TMiddlewareContext> {
    //# region API Публичного контроллера

    applyFilterDescription(
        filterDescription: IFilterItem[],
        newState?: Partial<TState>,
        appliedFrom?: string
    ): IFilterItem[] | void {
        const nextState = calculateFilterByFilterDescription(
            this.state,
            filterDescription,
            newState,
            appliedFrom
        );
        if (nextState?.filterDescription) {
            this._updateStateWithFilter(nextState);
        }
        return nextState?.filterDescription;
    }

    resetFilterDescription(): void {
        const { resetFilterDescription } = getFilterModuleSync().FilterDescription;
        const newFilterDescription = resetFilterDescription(this.state.filterDescription, true);
        this.applyFilterDescription(newFilterDescription);
    }

    //# endregion API Публичного контроллера

    protected _updateStateWithFilter(nextState: Partial<TState>): void {
        this.setState(nextState);
    }
}
