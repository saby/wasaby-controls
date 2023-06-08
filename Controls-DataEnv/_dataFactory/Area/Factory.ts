import {
    IAreaDataFactoryResult,
    IAreaDataFactoryArguments,
} from './IAreaDataFactory';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { default as AreaSlice } from './Slice';

const loadData = (
    config: IAreaDataFactoryArguments,
    dependenciesResults?: Record<string, unknown>,
    loadDataTimeout?: number
): Promise<IAreaDataFactoryResult> => {
    const loadPromises = [];
    config.initialKeys.forEach((key) => {
        loadPromises.push(
            Loader.load(config.configs[key], loadDataTimeout).then((data) => {
                return {
                    [key]: data,
                };
            })
        );
    });
    return Promise.all(loadPromises).then((datas) => {
        const results = {};
        datas.forEach((data) => {
            results = { ...results, ...data };
        });
        return {
            results,
            config,
            type: 'area',
        };
    });
};

export default {
    loadData,
    slice: AreaSlice,
};
