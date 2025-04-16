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
import { URL } from 'Browser/Transport';
import { Serializer } from 'Types/serializer';
import { Logger } from 'UI/Utils';
import { query } from 'Application/Env';
import { object } from 'Types/util';
import { IRouter } from 'Router/router';

/**
 * Фабрика фильтра.
 * @class Controls/_filterDataFactory/Factory
 * @public
 */

/**
 * @name Controls/_filterDataFactory/Factory#slice
 * @cfg {Controls/filterDataFactory:FilterSlice} Слайс фильтра.
 */

/**
 * Метод загрузки данных для фильтра.
 * @function Controls/_filterDataFactory/Factory#loadData
 * @param {Controls-ListEnv/filterDataFactory:IFilterArguments} config Аргументы фабрики данных фильтра.
 */

const loadData = async (
    config: IFilterArguments = { filterDescription: [] },
    _dependenciesResults: {},
    Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
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

    const urlStateId = config.listConfigStoreId || fabricId;
    const filterDescriptionFromUrl = urlStateId && getStateFromUrl(urlStateId)?.filterDescription;

    if (filterDescriptionFromUrl) {
        filterLoadedData.historyData = filterDescriptionFromUrl;
        cleanUrl(Router);
    } else if (config.historyItems) {
        filterLoadedData.historyData = config.historyItems;
    } else if (config.historyId) {
        historyPromise = FilterHistory.getHistoryItems(
            config.historyId,
            config.filterDescription,
            config.historySaveMode,
            config.prefetchParams
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
            object.clonePlain(resultFilterDescription),
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
        resultFilterDescription = await FilterLoader.loadFilterDescriptionData(
            resultFilterDescription,
            config.editorsViewMode
        );
    }

    return {
        filterDescription: resultFilterDescription,
    };
};

function cleanUrl(Router: IRouter): void {
    const state = Router.maskResolver.calculateQueryHref({ ...query.get, listParams: undefined });

    Router.history.replaceState({
        state,
    });
}

function getStateFromUrl(id: string) {
    const urlFilter = URL.getQueryParam('listParams');
    if (urlFilter) {
        const applicationSerializer = new Serializer();
        let urlConfig;
        try {
            urlConfig = JSON.parse(
                decodeURIComponent(urlFilter),
                applicationSerializer.deserialize
            );
            return urlConfig?.[id];
        } catch (error) {
            Logger.warn('В url передан невалидный параметр listParams, он не будет применен');
            return null;
        }
    }
}

export default {
    loadData,
    slice: FilterSLice,
};
