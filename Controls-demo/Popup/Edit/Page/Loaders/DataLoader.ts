import { load } from 'Core/library';
import { DataLoader } from 'Controls/dataSource';

export function loadData(prefetchConfig: Record<string, any>): Promise<any> {
    return load(prefetchConfig.configLoader).then((loaderModule) => {
        return new DataLoader()
            .load(loaderModule.getConfig(prefetchConfig.configLoaderArguments))
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
