import { Slice } from 'Controls-DataEnv/slice';

export interface IAsyncSliceState {
    updatesCount: number;
    someField: number;
}

class FactoryWithSearchValue extends Slice<IAsyncSliceState> {
    protected _initState(): IAsyncSliceState {
        return {
            updatesCount: 0,
            someField: 0,
        };
    }

    protected async _beforeApplyState(nextState: IAsyncSliceState): Promise<IAsyncSliceState> {
        nextState.updatesCount += 1;
        return nextState;
    }
}

export default {
    loadData: null,
    slice: FactoryWithSearchValue,
};
