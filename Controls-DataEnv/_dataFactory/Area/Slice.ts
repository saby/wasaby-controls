import { Slice } from 'Controls-DataEnv/slice';
import {
    IAreaDataFactoryArguments,
    IAreaDataFactoryResult,
} from './IAreaDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { IDataConfig } from '../interface/IDataConfig';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Logger } from 'UI/Utils';

export interface IAreaState {
    config: Record<TKey, IDataConfig>;
    results: Record<TKey, unknown>;
}

export default class AreaSlice extends Slice<IAreaState> {
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
                        results,
                    };
                });
            }
        } else {
            Logger.error('Area:Initializer: Указан не существующий ключ.');
        }
        return state;
    }

    _initState(
        loadResult: IAreaDataFactoryResult,
        config: IAreaDataFactoryArguments
    ): IAreaState {
        return {
            ...loadResult,
        };
    }
}
