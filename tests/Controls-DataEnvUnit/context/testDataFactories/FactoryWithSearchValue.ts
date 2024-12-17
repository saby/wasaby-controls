import { Slice } from 'Controls-DataEnv/slice';

export interface ISliceWithSearchValueState {
    searchValue: string;
}

class FactoryWithSearchValue extends Slice<ISliceWithSearchValueState> {
    protected _onChangeState: Function;
    protected _name: string;

    protected _initState(loadResult, config): ISliceWithSearchValueState {
        this._name = loadResult.name;
        this._onChangeState = loadResult.onChangeState;
        return {
            searchValue: config.searchValue || 'initSearchValue', // эмуляция логики работы слайса списка, где searchValue может прийти из другого слайса
        };
    }
    protected _beforeApplyState(
        nextState: ISliceWithSearchValueState
    ): Promise<ISliceWithSearchValueState> | ISliceWithSearchValueState {
        this._onChangeState?.(this._name);
        return super._beforeApplyState(nextState);
    }
}

export default {
    loadData: null,
    slice: FactoryWithSearchValue,
};
