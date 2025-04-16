import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ICoreState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import { cookie } from 'Application/Env';

export default function initState(
    _: Initializer,
    loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ICoreState {
    return {
        sliceOwnedByBrowser: !!config.sliceOwnedByBrowser,
        isLatestInteractorVersion: loadResult.isLatestInteractorVersion,
        loading: false,
        command: null,
        displayProperty: config.displayProperty,
        isDebugging: !!config.isDebugging,
        itemsOrder: loadResult.itemsOrder || config.itemsOrder || 'default',
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
