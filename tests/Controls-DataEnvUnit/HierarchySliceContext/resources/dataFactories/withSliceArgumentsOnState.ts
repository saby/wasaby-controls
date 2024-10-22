import { Slice } from 'Controls-DataEnv/slice';

export class ArgumentsSlice extends Slice {
    protected _initState(loadResult: unknown, _config: unknown): unknown {
        return _config;
    }
}

export default {
    async loadData(dataFactoryArguments: unknown) {
        return dataFactoryArguments;
    },
    slice: ArgumentsSlice,
};
