import { Slice } from 'Controls-DataEnv/slice';

export interface ISearchDemoSliceState {
    searchValue: string;
}

class SearchTestFactory extends Slice<ISearchDemoSliceState> {
    protected _onChangeState: Function;
    protected _name: string;
    protected _initState(loadResult): ISearchDemoSliceState {
        this._name = loadResult.name;
        this._onChangeState = loadResult.onChangeState;
        return {
            searchValue: 'searchValueFromSearch',
        };
    }

    protected _beforeApplyState(
        nextState: ISearchDemoSliceState
    ): Promise<ISearchDemoSliceState> | ISearchDemoSliceState {
        this._onChangeState?.(this._name);
        return super._beforeApplyState(nextState);
    }
}

export default {
    loadData: null,
    slice: SearchTestFactory,
};
