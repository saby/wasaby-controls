import { Slice } from 'Controls-DataEnv/slice';
import { IAreaDataFactoryArguments, IAreaDataFactoryResult } from './IAreaDataFactory';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { logger as Logger } from 'Application/Env';

/**
 * @public
 */
export interface IAreaState {
    /**
     *
     */
    config: IAreaDataFactoryArguments;
    /**
     *
     */
    results: Record<string, unknown>;
}

/**
 * Класс реализующий слайс переключаемых областей.
 * @public
 */
export default class AreaSlice extends Slice<IAreaState> {
    config: IAreaDataFactoryArguments;
    results: Record<string, unknown>;
    _promiseReject: Function | null;

    load(state: IAreaState, key: string): Promise<IAreaState> {
        const configs = state.config.configs[key];
        if (configs) {
            const loadResult = loadSync<typeof import('Controls-DataEnv/dataLoader')>(
                'Controls-DataEnv/dataLoader'
            ).Loader.load(configs);
            if (loadResult instanceof Promise) {
                return new Promise<IAreaState>((resolve, reject) => {
                    this._promiseReject = reject;

                    loadResult.then((data: object): void => {
                        this._promiseReject = null;
                        const results = {
                            ...this.state.results,
                            ...{ [key]: data },
                        };
                        if (!this.isDestroyed()) {
                            this.setState({
                                results,
                            });
                        }
                        resolve({
                            ...loadResult,
                            config: state.config,
                            results,
                        });
                    });
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

    destroy(): void {
        this._promiseReject?.();
        super.destroy();
    }
}
