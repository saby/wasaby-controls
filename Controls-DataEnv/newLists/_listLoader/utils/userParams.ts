import { IListDataFactoryArguments } from 'Controls-DataEnv/list';
import { USER } from 'ParametersWebAPI/Scope';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Serializer } from 'Types/serializer';
import type { TKey } from 'Controls-DataEnv/interface';
import type { TSortingOptionValue, TItemsOrder } from 'Controls-DataEnv/listTypes';

const SORTING_USER_PARAM_POSTFIX = '-sorting';
const ITEMS_ORDER_USER_PARAM_POSTFIX = '-itemsOrder';
const PREFIX_STORE_KEY_COLLAPSED_GROUP = 'LIST_COLLAPSED_GROUP_';
const FILTER_USER_PARAM_POSTFIX = '-filterUserConfiguration';
const COUNT_FILTER_USER_PARAM_POSTFIX = '-countFilterValue';
const NOT_NULLABLE_PROPS = ['sorting', 'expandedItems', 'countFilterValue'];

type TSavedParamsProps = Pick<
    IListDataFactoryArguments,
    | 'propStorageId'
    | 'filterDescription'
    | 'rootHistoryId'
    | 'parentProperty'
    | 'nodeHistoryId'
    | 'groupHistoryId'
    | 'onSavedParamsLoaded'
>;

/**
 * @private
 */
export interface ISavedParamsResult {
    sorting?: TSortingOptionValue;
    countFilterValue?: number;
    root?: TKey;
    expandedItems?: TKey[];
    itemsOrder?: TItemsOrder;
    collapsedGroups?: (string | number)[];
    storedColumnsWidths?: string[];
}

export function loadUserParams(config: TSavedParamsProps): Promise<ISavedParamsResult> {
    const userParams = getUserParamsForLoad(config);

    if (!userParams.length) {
        return Promise.resolve({});
    }

    const { propStorageId, onSavedParamsLoaded } = config;

    const userCallbackPromise = getCallbackPromise(onSavedParamsLoaded);

    return _loadUserParams(userParams).then(async () => {
        const result = getUserParamsResult(config, propStorageId);

        if (userCallbackPromise) {
            return handleUserCallback(userCallbackPromise, config, result);
        } else {
            return result;
        }
    });
}

export function loadColumnsWidths(propStorageId: string): Promise<string[] | undefined> {
    return loadAsync<typeof import('Controls/Application/SettingsController')>(
        'Controls/Application/SettingsController'
    )
        .then((result) => result.loadSavedConfig(propStorageId, ['storedColumnsWidths']))
        .then((res) => {
            return res.storedColumnsWidths;
        });
}

function _loadUserParams(
    userParams: string[]
): ReturnType<typeof import('ParametersWebAPI/Scope').USER.load> {
    return USER.load(userParams);
}

function getUserParam<T>(paramName: string): T | undefined {
    const configValue = USER.getConfig().get(paramName);
    if (configValue !== undefined) {
        try {
            const value = JSON.parse(configValue, new Serializer().deserialize);
            return value !== 'undefined' ? value : undefined;
        } catch (e) {
            return configValue as T;
        }
    } else {
        return undefined;
    }
}

function getUserParamsForLoad(config: TSavedParamsProps): string[] {
    const userParams = [];
    const { propStorageId } = config;

    if (propStorageId) {
        userParams.push(
            propStorageId + ITEMS_ORDER_USER_PARAM_POSTFIX,
            propStorageId + SORTING_USER_PARAM_POSTFIX
        );

        if (config.filterDescription) {
            userParams.push(
                propStorageId + FILTER_USER_PARAM_POSTFIX,
                propStorageId + COUNT_FILTER_USER_PARAM_POSTFIX
            );
        }
    }

    if (config.rootHistoryId && config.parentProperty) {
        userParams.push(config.rootHistoryId);
    }

    if (config.nodeHistoryId) {
        userParams.push(config.nodeHistoryId);
    }

    if (config.groupHistoryId) {
        userParams.push(PREFIX_STORE_KEY_COLLAPSED_GROUP + config.groupHistoryId);
    }

    return userParams;
}

function getCallbackPromise(
    onSavedParamsLoaded: IListDataFactoryArguments['onSavedParamsLoaded']
): Promise<Function | undefined> {
    return typeof onSavedParamsLoaded === 'string'
        ? loadAsync<Function>(onSavedParamsLoaded)
        : Promise.resolve(onSavedParamsLoaded);
}

function getUserParamsResult(
    config: TSavedParamsProps,
    propStorageId?: string
): ISavedParamsResult {
    const { rootHistoryId, nodeHistoryId, groupHistoryId, parentProperty, filterDescription } =
        config;

    let sorting;
    let itemsOrder;
    let countFilterValue;
    let root;
    let expandedItems;
    let collapsedGroups;

    if (propStorageId) {
        sorting = getUserParam<TSortingOptionValue>(propStorageId + SORTING_USER_PARAM_POSTFIX);
        itemsOrder = getUserParam<TItemsOrder>(propStorageId + ITEMS_ORDER_USER_PARAM_POSTFIX);

        if (filterDescription) {
            countFilterValue = getUserParam<number>(
                propStorageId + COUNT_FILTER_USER_PARAM_POSTFIX
            );
        }
    }

    if (rootHistoryId && parentProperty) {
        root = getUserParam<TKey>(rootHistoryId);
    }

    if (nodeHistoryId) {
        expandedItems = getUserParam<TKey[]>(nodeHistoryId);
    }

    if (groupHistoryId) {
        collapsedGroups = getUserParam<(string | number)[]>(
            PREFIX_STORE_KEY_COLLAPSED_GROUP + groupHistoryId
        );
    }

    const result: ISavedParamsResult = {
        sorting,
        itemsOrder,
        countFilterValue,
        root,
        expandedItems,
        collapsedGroups,
    };

    return (Object.keys(result) as (keyof ISavedParamsResult)[]).reduce(
        (acc: Record<string, unknown>, key) => {
            const val = result[key];
            if (val !== undefined && (!NOT_NULLABLE_PROPS.includes(key) || val !== null)) {
                acc[key] = val;
            }
            return acc;
        },
        {}
    );
}

async function handleUserCallback(
    userCallbackPromise: Promise<Function | undefined>,
    config: TSavedParamsProps,
    result: ISavedParamsResult
): Promise<ISavedParamsResult> {
    const callback = await userCallbackPromise;

    if (callback) {
        const callbackResult = callback(config, { ...result });

        if (callbackResult && callbackResult.root !== undefined) {
            result.root = callbackResult.root;
        }
    }

    return result;
}
