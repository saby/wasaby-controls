import { IAreaDataFactoryResult, IAreaDataFactoryArguments } from './IAreaDataFactory';
import { default as AreaSlice } from './Slice';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IRouter } from 'Router/router';

const loadData = (
    config: IAreaDataFactoryArguments,
    dependenciesResults?: Record<string, unknown>,
    Router?: IRouter
): Promise<IAreaDataFactoryResult> => {
    const loadPromises = [];
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
            results = { ...results, ...data };
        });
        return {
            results,
            type: 'area',
        };
    });
};
/**
 * Фабрика данных для переключаемых областей.
 * @class Controls-DataEnv/_dataFactory/Area/Factory
 * @public
 */

/**
 * @name Controls-DataEnv/_dataFactory/Area/Factory#slice
 * @cfg {Controls-DataEnv/_dataFactory/Area/Slice} Слайс переключаемых областей.
 */

/**
 * Метод загрузки данных переключаемых областей.
 * @function Controls-DataEnv/_dataFactory/Area/Factory#loadData
 * @param {Controls/_dataFactory/List/_interface/IListDataFactoryArguments} config Аргументы фабрики переключаемых областей.
 */
export default {
    loadData,
    slice: AreaSlice,
};
