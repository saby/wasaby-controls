import FilterSLice from './Slice';
import { IFilterLoadResult, IFilterArguments } from './interface';
import {
    FilterLoader,
    FilterHistory,
    FilterDescription,
    IFilterItemConfiguration,
    IFilterItem,
    THistoryData,
} from 'Controls/filter';

const loadData = async (
    config: IFilterArguments = { filterDescription: [] }
): Promise<IFilterLoadResult> => {
    let resultFilterDescription: IFilterItem[] = config.filterDescription;
    const filterLoadedData: {
        filterConfiguration?: IFilterItemConfiguration[];
        historyData?: THistoryData;
    } = {};
    let historyPromise;
    let configurationPromise;
    let callbacksPromise;

    const loadingPromises = [];

    if (!FilterLoader.isCallbacksLoaded(config.filterDescription)) {
        callbacksPromise = FilterLoader.loadCallbacks(config.filterDescription);
        loadingPromises.push(callbacksPromise);
    }

    if (config.historyId) {
        historyPromise = FilterHistory.resolveHistoryItems(
            config.historyId,
            config.historyItems,
            config.prefetchParams,
            config.filterDescription,
            config.historySaveMode
        ).then((historyData) => {
            filterLoadedData.historyData = historyData;
        });
        loadingPromises.push(historyPromise);
    }

    if (config.propStorageId) {
        configurationPromise = FilterLoader.loadFilterConfiguration(config.propStorageId).then(
            (filterConfiguration) => {
                filterLoadedData.filterConfiguration = filterConfiguration;
            }
        );
        loadingPromises.push(configurationPromise);
    }

    await Promise.all(loadingPromises);

    if (filterLoadedData.historyData) {
        resultFilterDescription = FilterDescription.mergeFilterDescriptions(
            FilterHistory.getHistoryItemsFromData(filterLoadedData.historyData)
        );
    }

    if (filterLoadedData.filterConfiguration) {
        resultFilterDescription = FilterDescription.applyFilterUserHistoryToDescription(
            resultFilterDescription,
            filterLoadedData.filterConfiguration
        );
    }

    if (FilterLoader.isNeedLoadFilterDescriptionData(resultFilterDescription)) {
        await FilterLoader.loadFilterDescriptionData(
            resultFilterDescription,
            config.editorsViewMode
        );
    }

    return {
        filterDescription: resultFilterDescription,
    };
};

export default {
    loadData,
    slice: FilterSLice,
};
