import { Slice } from 'Controls-DataEnv/slice';

export interface IProxyValuesFactory {
    config: unknown;
    loadResult: unknown;
    someValue: unknown;
}

class ProxyValuesFactory extends Slice<IProxyValuesFactory> {
    protected _initState(loadResult: unknown, config: unknown): IProxyValuesFactory {
        return {
            loadResult,
            config,
            someValue: null,
        };
    }
}

export default {
    loadData: null,
    slice: ProxyValuesFactory,
};
