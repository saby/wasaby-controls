import { Slice } from 'Controls-DataEnv/slice';
import { IAreaDataFactoryArguments, IAreaDataFactoryResult } from './IAreaDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Logger } from 'UI/Utils';

export interface IAreaState {
    config: IAreaDataFactoryArguments;
    results: Record<TKey, unknown>;
}

export default class AreaSlice extends Slice<IAreaState> {
    config: IAreaDataFactoryArguments;
    results: Record<TKey, unknown>;
    load(state: IAreaState, key: string): Promise<IAreaState> {
        const configs = state.config.configs[key];
        if (configs) {
            const loadResult = Loader.load(configs);
            if (loadResult instanceof Promise) {
                return loadResult.then((data: object): IAreaState => {
                    const results = {
                        ...this.state.results,
                        ...{ [key]: data },
                    };
                    this.setState({
                        results,
                    });
                    return {
                        ...loadResult,
                        config: state.config,
                        results,
                    };
                });
            }
        } else {
            Logger.error('Area:Initializer: Указан не существующий ключ.');
        }
        return Promise.resolve(state);
    }

    _initState(loadResult: IAreaDataFactoryResult, config: IAreaDataFactoryArguments): IAreaState {
        return {
            ...loadResult,
            config,
        };
    }
}
