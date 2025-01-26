import { USER } from 'ParametersWebAPI/Scope';
import {
    TKey,
    IPropStorageOptions,
    IHierarchyOptions,
    TSortingOptionValue,
} from 'Controls/interface';
import { ISourceControllerProps } from 'Controls/_dataSource/Controller/ISourceController';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { Serializer } from 'Types/serializer';
import { wrapTimeout } from 'Types/promise';
import { Logger } from 'UI/Utils';

const QUERY_PARAMS_LOAD_TIMEOUT = 5000;

export interface ISavedParamsResult {
    sorting?: TSortingOptionValue;
    countFilterValue?: number;
    root?: TKey;
}

type TOnSavedParamsLoadedCallback = (
    args: ISourceControllerProps,
    params: ISavedParamsResult
) => ISavedParamsResult | Promise<ISavedParamsResult>;

export interface ISavedParamsConfig
    extends IPropStorageOptions,
        Pick<IHierarchyOptions, 'parentProperty'> {
    rootHistoryId?: string;
    onSavedParamsLoaded?: string | TOnSavedParamsLoadedCallback;
}

const SORTING_USER_PARAM_POSTFIX = '-sorting';
const COUNT_FILTER_USER_PARAM_POSTFIX = '-countFilterValue';

function loadRoot(rootHistoryId: string): Promise<undefined | TKey> {
    return USER.load([rootHistoryId]).then((config) => {
        const savedRoot = JSON.parse(config.get(rootHistoryId));
        return savedRoot !== 'undefined' ? savedRoot : undefined;
    });
}

function loadParamsFromUserStorage(
    propStorageId: string
): Promise<Pick<ISavedParamsResult, 'sorting' | 'countFilterValue'>> {
    const sortingUserParamId = propStorageId + SORTING_USER_PARAM_POSTFIX;
    const countFilterUserParamId = propStorageId + COUNT_FILTER_USER_PARAM_POSTFIX;

    return USER.load([sortingUserParamId, countFilterUserParamId]).then((userParams) => {
        const sortingSavedInUserParams = userParams.get(sortingUserParamId);
        const countFilterValueParams = userParams.get(countFilterUserParamId);

        let sorting;
        let countFilterValue;

        if (sortingSavedInUserParams) {
            try {
                sorting = JSON.parse(sortingSavedInUserParams) as TSortingOptionValue;
            } catch (e) {
                /* empty */
            }
        }

        if (countFilterValueParams) {
            try {
                countFilterValue = JSON.parse(
                    countFilterValueParams,
                    new Serializer().deserialize
                ) as number;
            } catch (e) {
                /* empty */
            }
        }

        return {
            sorting,
            countFilterValue,
        };
    });
}

function loadSavedParamsLoaded(
    onSavedParamsLoaded: ISavedParamsConfig['onSavedParamsLoaded']
): Promise<unknown> {
    return typeof onSavedParamsLoaded === 'string'
        ? loadAsync(onSavedParamsLoaded)
        : Promise.resolve();
}

function loadParams(propStorageId: string): Promise<ISavedParamsResult> {
    let paramsPromise = Promise.all([loadParamsFromUserStorage(propStorageId)]).then(
        ([userSavedResult]) => {
            return {
                ...userSavedResult,
            };
        }
    );

    paramsPromise = wrapTimeout(paramsPromise, QUERY_PARAMS_LOAD_TIMEOUT).catch(() => {
        Logger.info('Controls-DataEnv/list:loadData: Параметры не загрузились за 1 секунду');
    }) as Promise<ISavedParamsResult>;

    return paramsPromise;
}

async function callUserCallback(
    onSavedParamsLoaded: TOnSavedParamsLoadedCallback | string,
    savedParamsResult: ISavedParamsResult,
    props: ISourceControllerProps
): Promise<ReturnType<TOnSavedParamsLoadedCallback> | undefined> {
    const callback: ISavedParamsConfig['onSavedParamsLoaded'] =
        typeof onSavedParamsLoaded === 'string'
            ? loadSync<TOnSavedParamsLoadedCallback>(onSavedParamsLoaded)
            : onSavedParamsLoaded;
    let userResult;

    try {
        userResult = await callback(props, savedParamsResult);
        if (!userResult) {
            throw new Error(
                'Из прикладной функции обратного вызова onSavedParamsLoaded необходимо вернуть стейт.'
            );
        }

        return userResult;
    } catch (e) {
        Logger.warn((e as any).toString());
    }
}

export default async function getSavedParams(
    props: ISourceControllerProps
): Promise<ISavedParamsResult> {
    const { propStorageId, rootHistoryId, parentProperty, onSavedParamsLoaded } = props;
    let paramsPromise;
    let rootPromise;
    let onSavedParamsLoadedPromise;

    if (propStorageId) {
        paramsPromise = loadParams(propStorageId);
    }

    if (rootHistoryId && parentProperty) {
        rootPromise = loadRoot(rootHistoryId);
    }

    if (onSavedParamsLoaded) {
        onSavedParamsLoadedPromise = loadSavedParamsLoaded(onSavedParamsLoaded);
    }

    return Promise.all([paramsPromise, rootPromise, onSavedParamsLoadedPromise]).then(
        async ([paramsResult, rootResult]) => {
            const result = {
                ...paramsResult,
                ...(rootResult !== undefined ? { root: rootResult } : {}),
            };

            if (onSavedParamsLoaded) {
                const userCallbackResult = await callUserCallback(
                    onSavedParamsLoaded,
                    result,
                    props
                );

                if (userCallbackResult && userCallbackResult.root !== undefined) {
                    result.root = userCallbackResult.root;
                }
            }

            return result;
        }
    );
}
