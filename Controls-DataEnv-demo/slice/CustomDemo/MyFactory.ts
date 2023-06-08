import { Slice } from 'Controls-DataEnv/slice';

class ExpandedSlice extends Slice {
    protected _initState(loadResult, dataFactoryParams) {
        return {
            expanded: loadResult,
        };
    }
}

const loadData = () => {
    return Promise.resolve(true);
};

const slice = ExpandedSlice;

export { loadData, slice };
