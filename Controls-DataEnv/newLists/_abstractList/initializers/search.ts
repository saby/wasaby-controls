import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ISearchState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import { loadSync } from 'WasabyLoader/ModulesLoader';

const DEFAULT_MIN_SEARCH_LENGTH = 3;
const DEFAULT_SEARCH_STARTING_WITH: ISearchState['searchStartingWith'] = 'root';
const DEFAULT_SEARCH_NAV_MODE: ISearchState['searchNavigationMode'] = 'open';

export default function initState(
    initializer: Initializer,
    _loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ISearchState {
    const state: ISearchState = {
        searchMisspellValue: '',
        searchParam: config.searchParam,
        searchValue: config.searchParam ? config.searchValue || '' : '',
        searchInputValue: config.searchParam
            ? config.searchInputValue || config.searchValue || ''
            : '',
        minSearchLength:
            config.minSearchLength === undefined
                ? DEFAULT_MIN_SEARCH_LENGTH
                : config.minSearchLength,
        searchDelay: config.searchDelay,
        searchStartingWith: config.searchStartingWith || DEFAULT_SEARCH_STARTING_WITH,
        searchValueTrim: !!config.searchValueTrim,
        searchNavigationMode: config.searchNavigationMode || DEFAULT_SEARCH_NAV_MODE,
    };

    if (config.searchValue) {
        const { FilterResolver } = loadSync<typeof import('Controls/search')>('Controls/search');

        const items = initializer.getItemsState().items;
        state.searchMisspellValue = (items && FilterResolver.getSwitcherStrFromData(items)) || '';
    }

    return state;
}
