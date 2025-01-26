import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IFilterState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default function initState(
    _: Initializer,
    loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IFilterState {
    const state: IFilterState = {
        filter: config.filter,
        filterDetailPanelVisible: false,
    };

    const filterDescriptionConfig =
        loadResult.filterDescription ||
        loadResult.filterButtonSource ||
        config.filterButtonSource ||
        config.filterDescription;

    if (filterDescriptionConfig) {
        const {
            FilterLoader: { initFilterDescriptionFromData },
        } = loadSync<typeof import('Controls/filter')>('Controls/filter');
        state.filterDescription = initFilterDescriptionFromData(filterDescriptionConfig);
    }

    return state;
}
