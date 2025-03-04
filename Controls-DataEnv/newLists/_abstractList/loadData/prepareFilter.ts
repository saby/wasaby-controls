/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadAsync } from 'WasabyLoader/ModulesLoader';

import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';

type TFilterResult = ReturnType<
    (typeof import('Controls/filter').FilterCalculator)['prepareFilter']
>;

export function prepareFilterIfNeed(
    config: IAbstractListDataFactoryArguments,
    fabricId?: string
): TFilterResult | undefined {
    return isNeedPrepareFilter(config) ? prepareFilter(config, fabricId) : undefined;
}

export function isNeedPrepareFilter(loadDataConfig: IAbstractListDataFactoryArguments): boolean {
    return !!(loadDataConfig.filterDescription || loadDataConfig.searchParam);
}

function prepareFilter(
    config: IAbstractListDataFactoryArguments,
    fabricId?: string
): TFilterResult {
    return loadAsync<typeof import('Controls/filter')>('Controls/filter').then((FilterModule) =>
        FilterModule.FilterCalculator.prepareFilter(config, fabricId)
    );
}
