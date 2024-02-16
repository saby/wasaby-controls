import { load } from 'Core/library';

export function loadData(prefetchConfig: Record<string, any>): Promise<any> {
    return load(prefetchConfig.configLoader).then((loaderModule) => {
        return import('Controls/dataSourceOld')
            .then(({ DataLoader }) =>
                new DataLoader().load(loaderModule.getConfig(prefetchConfig.configLoaderArguments))
            )
            .then((result) => {
                const preparedResult = {};
                Object.keys(result).forEach((key) => {
                    preparedResult[key] = {
                        prefetchResult: result[key],
                    };
                });
                return {
                    data: preparedResult,
                };
            });
    });
}
