import { Slice } from 'Controls-DataEnv/slice';

export interface ISearchDemoSliceState {
    searchValue: string;
}

class SearchTestFactory extends Slice<ISearchDemoSliceState> {
    protected _initState(): ISearchDemoSliceState {
        return {
            searchValue: 'searchValueFromSearch',
        };
    }
}

export default {
    loadData: null,
    slice: SearchTestFactory,
};
