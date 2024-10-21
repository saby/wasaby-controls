import { AbstractSlice } from 'Controls-DataEnv/slice';

interface IFilterSliceState {
    filter: {
        active: boolean;
    };
}

class FilterSlice extends AbstractSlice<IFilterSliceState> {
    protected _initState(
        loadResult: IFilterSliceState,
        config: IFilterSliceState
    ): IFilterSliceState {
        return {
            filter: loadResult.filter,
        };
    }
}

export default {
    async loadData() {
        return {
            filter: {
                active: true,
            },
        };
    },
    slice: FilterSlice,
};
