import { Slice } from 'Controls-DataEnv/slice';

class SearchSlice extends Slice {
    protected _initState(_loadResult: unknown, _config: unknown): unknown {
        return {
            value: '',
        };
    }
}

export default {
    async loadData(): Promise<unknown> {
        return 1;
    },
    slice: SearchSlice,
};
