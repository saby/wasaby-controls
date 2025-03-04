import { Slice } from 'Controls-DataEnv/slice';

interface IState {
    expanded: boolean;
}

class ExpandedSlice extends Slice<IState> {
    protected _initState(loadResult: boolean, dataFactoryParams) {
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
