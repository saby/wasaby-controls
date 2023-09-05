import { Slice } from 'Controls-DataEnv/slice';

export interface ISliceWithSearchValueState {
    searchValue: string;
    extraSearchValue: string;
}

class FactoryWithSearchValue extends Slice<ISliceWithSearchValueState> {
    protected _initState(config, result, extraValues): ISliceWithSearchValueState {
        return {
            searchValue: 'initSearchValue',
            extraSearchValue: extraValues.searchValue,
        };
    }
}

export default {
    loadData: null,
    slice: FactoryWithSearchValue,
};
