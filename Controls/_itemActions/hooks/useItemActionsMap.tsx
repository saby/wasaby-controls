import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { IAction, TKey } from 'Controls/interface';
import type { ActionsCollection, MenuSource } from 'Controls/actions';

import { getActionsLib } from 'Controls/_itemActions/utils/loaderUtils';
import { usePreviousProps } from 'Controls/hooks';
import { isEqual } from 'Types/object';

interface IUseItemActionsMapProps {
    storeId: string;
    isAdaptive?: boolean;
}

export interface IItemActionsData {
    // Список экшнов, по которым строится тулбар
    actions: RecordSet<IAction>;
    // Источник данных для формирования меню и контекстного меню.
    menuSource: MenuSource;
    // Коллекция, которая содержит методы для получения executable
    actionsCollection: ActionsCollection;
}

export type TItemActionsCollectionsMap = Map<TKey, IItemActionsData>;

const START_ORDER_NOT_DEFAULT_ACTIONS = 1000;

/*
 * Сортирует экшны аналогично тому, как это происходит в тулбаре
 * @param actions
 */
function prepareActionsOrder(actions: IAction[]): IAction[] {
    return actions.slice().map((action) => {
        if (!action.order) {
            return { ...action, order: START_ORDER_NOT_DEFAULT_ACTIONS };
        }

        return {
            ...action,
            order: action.order + START_ORDER_NOT_DEFAULT_ACTIONS,
        };
    });
}

/*
 * Собирает RecordSet из экшнов аналогично тому, как это происходит в тулбаре
 */
function getToolbarRs(items: IAction[]): RecordSet {
    return new RecordSet({
        keyProperty: 'id',
        rawData: items.map((action) => {
            return { ...action };
        }),
    });
}

// Создаёт контекст, который отдаётся в BaseAction в опцию context
function createContextForBaseAction(itemKey: TKey, slice: ListSlice): Record<string, unknown> {
    const item = slice.state.items?.getRecordById(itemKey as string | number);
    return {
        item,
        slice,
    };
}

// Создаёт объект ActionsData, содержащий коллекцию экшнов для записи и источник даных меню
function createBaseActionDataObjectForItem(
    itemKey: TKey,
    itemActions: IAction[],
    slice: ListSlice,
    isAdaptive?: boolean
) {
    const { MenuSource, ActionsCollection } = getActionsLib();
    const context = createContextForBaseAction(itemKey, slice);
    const actions = prepareActionsOrder(itemActions);
    const actionsCollection = new ActionsCollection({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        actions,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        prefetch: context,
        sourceController: slice.state.sourceController,
        isAdaptive,
        changeShowTypeInAdaptive: true,
        changeMenuItemsShowType: false,
    });
    const menuSource = new MenuSource({
        collection: actionsCollection,
    });
    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        actions: getToolbarRs(actionsCollection.getToolbarItems()),
        actionsCollection,
        menuSource,
    };
}

// Карта соответствия item => ActionsData.
function createItemActionsCollectionsMap(
    sliceIAMap: Map<TKey, IAction[]>,
    slice: ListSlice,
    isAdaptive?: boolean
): TItemActionsCollectionsMap {
    const { MenuSource, ActionsCollection } = getActionsLib();
    const nextIACMap: TItemActionsCollectionsMap = new Map();
    if (sliceIAMap && MenuSource && ActionsCollection) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sliceIAMap.forEach((itemActions: IAction[], itemKey: string | number) => {
            const actionData = createBaseActionDataObjectForItem(
                itemKey,
                itemActions,
                slice,
                isAdaptive
            );
            if (!actionData) {
                return;
            }
            nextIACMap.set(itemKey, actionData);
        });
    }
    return nextIACMap;
}

// Обновляет карту данных для экшнов у каждой записи. Сравнивает карты - в слайсе и в стейте хука.
// Для удалённых записей удаляет из карты.
// Для одинаковых вызывает updateContext.
// Для новых создаёт ActionsData и добавляет в карту.
function updateItemActionsCollectionsMap(
    prevIACMap: TItemActionsCollectionsMap,
    slice: ListSlice,
    isAdaptive?: boolean
): TItemActionsCollectionsMap | null {
    const sliceIAMap = slice.state.itemActionsMap;
    if (!sliceIAMap) {
        return null;
    }
    const nextIACMap = new Map(prevIACMap);
    const nextIACMapKeys = Array.from(nextIACMap.keys());
    const sliceIAMapKeys = Array.from(sliceIAMap.keys());
    const intersectionKeys: TKey[] = [];

    nextIACMapKeys.forEach((itemKey) => {
        if (!sliceIAMap.has(itemKey)) {
            nextIACMap.delete(itemKey);
        } else {
            intersectionKeys.push(itemKey);
        }
    });

    sliceIAMapKeys.forEach((itemKey) => {
        if (!nextIACMap.has(itemKey)) {
            const itemActions = sliceIAMap.get(itemKey);
            const actionData = createBaseActionDataObjectForItem(
                itemKey,
                itemActions,
                slice,
                isAdaptive
            );
            nextIACMap.set(itemKey, actionData);
        }
    });

    intersectionKeys.forEach((itemKey: TKey) => {
        const actionsData = nextIACMap.get(itemKey);
        if (!actionsData) {
            return;
        }
        actionsData.actionsCollection.notifyActionsUpdateContext(
            createContextForBaseAction(itemKey, slice)
        );
        const newActionsRs = getToolbarRs(actionsData.actionsCollection.getToolbarItems());
        if (!isEqual(newActionsRs, actionsData.actions)) {
            actionsData.actions = newActionsRs;
        }
    });

    return nextIACMap;
}

export function useItemActionsMap(
    props: IUseItemActionsMapProps
): TItemActionsCollectionsMap | null {
    // Слайс списка
    const slice = useSlice(props.storeId) as ListSlice;
    // Стейт слайса списка
    const sliceState = slice?.state || {};
    // Определяем, что вид изменился
    const { prevViewMode } = usePreviousProps({ prevViewMode: sliceState.viewMode });
    const viewModeChanged = prevViewMode && prevViewMode !== sliceState.viewMode;
    const itemsVersion = sliceState.items?.getVersion();

    const [itemActionsMapState, setItemActionsMapState] =
        React.useState<TItemActionsCollectionsMap | null>(() =>
            createItemActionsCollectionsMap(sliceState.itemActionsMap, slice, props.isAdaptive)
        );

    React.useEffect(() => {
        let result;
        if (viewModeChanged) {
            result = createItemActionsCollectionsMap(
                sliceState.itemActionsMap,
                slice,
                props.isAdaptive
            );
        } else {
            result = updateItemActionsCollectionsMap(itemActionsMapState, slice, props.isAdaptive);
        }
        setItemActionsMapState(result);
    }, [
        viewModeChanged, // Поменялся viewMode, надо ПЕРЕСОЗДАТЬ itemActions, т.к. у них мог поменяться showType
        sliceState.items,
        itemsVersion, // поменялась версия recordSet, надо обновить itemActions, т.к. у них мог поменяться visibility
        sliceState.itemActionsMap,
        slice,
        props.isAdaptive,
    ]);

    return itemActionsMapState;
}
