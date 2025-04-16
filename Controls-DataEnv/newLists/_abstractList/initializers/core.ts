import type { TViewMode } from 'Controls-DataEnv/interface';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ICoreState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import { cookie } from 'Application/Env';

export default function initState(
    initializer: Initializer,
    loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ICoreState {
    return {
        sliceOwnedByBrowser: !!config.sliceOwnedByBrowser,
        sliceOwnedByExplorer: !!config.sliceOwnedByExplorer,
        isLatestInteractorVersion: loadResult.isLatestInteractorVersion,
        loading: false,
        command: null,
        viewCommands: [],
        displayProperty: config.displayProperty,
        isDebugging: !!config.isDebugging,
        itemsOrder: loadResult.itemsOrder || config.itemsOrder || 'default',
        viewMode: initViewMode(
            config.viewMode || loadResult.viewMode,
            initializer.getSearchState().searchValue
        ),
    };
}

const COOKIE_LOG_KEY = 'ListInteractorDebug';
const SABY_DEBUG_COOKIE_KEY = 's3debug';
const LISTS_MODULE = 'Controls-Lists';

export const getDebugCookie = (): string => {
    const mainCookie = cookie.get(COOKIE_LOG_KEY) as string;
    if (mainCookie) {
        return mainCookie;
    }
    const sabyDebug = cookie.get(SABY_DEBUG_COOKIE_KEY);

    if (!sabyDebug) {
        return '';
    }

    const hasListsDebug = !!sabyDebug.split(',').find((module) => module.trim() === LISTS_MODULE);

    return hasListsDebug ? 'mode=Dev' : '';
};

export const initViewMode = (viewMode?: TViewMode, searchValue?: string): TViewMode => {
    return viewMode || (searchValue ? 'search' : 'table');
};
