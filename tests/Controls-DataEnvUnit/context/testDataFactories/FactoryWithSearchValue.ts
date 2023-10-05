import { Slice } from 'Controls-DataEnv/slice';

export interface ISliceWithSearchValueState {
    searchValue: string;
}

class FactoryWithSearchValue extends Slice<ISliceWithSearchValueState> {
    protected _initState(loadResult, config): ISliceWithSearchValueState {
        return {
            searchValue: config.searchValue || 'initSearchValue', // эмуляция логики работы слайса списка, где searchValue может прийти из другого слайса
        };
    }
}

export default {
    loadData: null,
    slice: FactoryWithSearchValue,
};
