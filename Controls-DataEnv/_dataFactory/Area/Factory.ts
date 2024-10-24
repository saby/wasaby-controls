import { IAreaDataFactoryResult, IAreaDataFactoryArguments } from './IAreaDataFactory';
import { default as AreaSlice } from './Slice';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IRouter } from 'Router/router';

/**
 * Фабрика данных для переключаемых областей.
 * @public
 */
export default class Factory {
    /**
     * Метод загрузки данных переключаемых областей.
     * @param config Аргументы фабрики переключаемых областей.
     */
    static loadData(
        config: IAreaDataFactoryArguments,
        _dependenciesResults?: Record<string, unknown> | undefined,
        Router?: IRouter
    ): Promise<IAreaDataFactoryResult> {
        const loadPromises: Promise<unknown>[] = [];
        config.initialKeys.forEach((key) => {
            loadPromises.push(
                loadSync<typeof import('Controls-DataEnv/dataLoader')>('Controls-DataEnv/dataLoader')
                    .Loader.load(config.configs[key], undefined, Router)
                    .then((data) => {
                        return {
                            [key]: data,
                        };
                    })
            );
        });
        return Promise.all(loadPromises).then((datas) => {
            let results = {};
            datas.forEach((data) => {
                // @ts-ignore
                results = { ...results, ...data };
            });
            return {
                results,
                type: 'area',
            };
        });
    }

    /**
     * Слайс переключаемых областей.
     */
    static slice = AreaSlice;
};
