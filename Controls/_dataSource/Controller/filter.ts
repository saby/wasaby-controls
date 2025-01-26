import { IFilterDescriptionItem } from 'Controls/filter';
import { TEditorsViewMode } from 'Controls/filterPanel';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { QueryWhereExpression } from 'Types/source';

export interface IFilterDepsLoadConfig {
    editorsViewMode?: TEditorsViewMode;
    countFilterValueConverter?: (
        value: string | Date | Date[],
        filterItem: IFilterDescriptionItem,
        filterDescription: IFilterDescriptionItem[]
    ) => QueryWhereExpression<unknown>;
    filter?: Record<string, unknown>;
    searchParam?: string;
    loadDataTimeout?: number;
}

/**
 * Функция загрузки зависимостей фильтра
 * */
export async function loadFilterDescriptionDeps(
    filterDescription: IFilterDescriptionItem[],
    config: IFilterDepsLoadConfig,
    countFilterValue?: unknown
): Promise<IFilterDescriptionItem[] | void> {
    let loadFilterDataPromise;
    let loadFilterPanelExtendedItemsPromise;
    let loadFilterDataAndCallbacksPromise;
    let loadFilterLibPromise;

    if (filterDescription) {
        if (!isLoaded('Controls/filter')) {
            await loadAsync('Controls/filter');
        }
        addPageDeps(['Controls/filter']);
    }

    const { FilterLoader, FilterDescription, loadCallbacks, loadEditorTemplateName } =
        loadSync<typeof import('Controls/filter')>('Controls/filter');
    const loadFilterCallbacksPromise = loadCallbacks(filterDescription);
    const { countFilterValueConverter, editorsViewMode } = config;
    let countFilterPromise;
    if (typeof countFilterValueConverter === 'string') {
        countFilterPromise = loadAsync(countFilterValueConverter);
        addPageDeps([countFilterValueConverter]);
    }

    if (filterDescription && FilterLoader.isNeedLoadFilterDescriptionData(filterDescription)) {
        loadFilterDataPromise = Promise.all([loadFilterCallbacksPromise, countFilterPromise]).then(
            () => {
                const filterDescr = FilterDescription.isFilterDescriptionChanged(filterDescription)
                    ? FilterDescription.callFilterChangedCallbackOnFilterDescription(
                          filterDescription,
                          config.filter
                      )
                    : filterDescription;
                const filterDescriptionWithFilterCount = FilterDescription.applyFilterCounter(
                    countFilterValue,
                    filterDescr,
                    config
                );
                return FilterLoader.loadFilterDescriptionData(
                    filterDescriptionWithFilterCount,
                    editorsViewMode ?? 'default',
                    config.loadDataTimeout,
                    false,
                    'panel'
                );
            }
        );

        if (
            FilterLoader.isNeedLoadExtendedItemsTemplate(
                filterDescription,
                editorsViewMode ?? 'default'
            ) &&
            !isLoaded('Controls/filterPanelExtendedItems')
        ) {
            loadFilterPanelExtendedItemsPromise = loadAsync<
                typeof import('Controls/filterPanelExtendedItems')
            >('Controls/filterPanelExtendedItems');
        }
    }

    const loadFilterEditorsPromise = loadEditorTemplateName(
        filterDescription,
        editorsViewMode,
        config.searchParam
    );

    if (filterDescription.find((filter) => !!filter.filterVisibilityCallback)) {
        loadFilterDataAndCallbacksPromise = Promise.all([
            loadFilterDataPromise,
            loadFilterCallbacksPromise,
        ]).then(([loadedFilterDescription]) => {
            FilterDescription.callVisibilityCallbackOnFilterDescription(
                loadedFilterDescription || filterDescription,
                config.filter
            );
            return loadedFilterDescription;
        });
    }

    if (filterDescription) {
        loadFilterLibPromise = loadAsync('Controls/filter');
    }

    return Promise.all([
        loadFilterDataPromise,
        loadFilterPanelExtendedItemsPromise,
        loadFilterCallbacksPromise,
        loadFilterEditorsPromise,
        loadFilterDataAndCallbacksPromise,
        loadFilterLibPromise,
    ]).then(([filterDescription]) => filterDescription);
}
