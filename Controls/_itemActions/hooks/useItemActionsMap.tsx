import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { IAction, TKey } from 'Controls/interface';
import type { ActionsCollection, MenuSource } from 'Controls/actions';

import { getActionsLib } from 'Controls/_itemActions/utils/loaderUtils';
import { usePreviousProps } from 'Controls/hooks';
import { isEqual } from 'Types/object';
import type { ScrollControllerLib } from 'Controls/listsCommonLogic';
import type { GridRow } from 'Controls/gridDisplay';

interface IUseItemActionsMapProps {
    storeId: string;
    virtualScrollRange?: ScrollControllerLib.IItemsRange;
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
): IItemActionsData | undefined {
    const { MenuSource, ActionsCollection } = getActionsLib();
    const context = createContextForBaseAction(itemKey, slice);
    const actions = prepareActionsOrder(itemActions);
    if (!ActionsCollection) {
        return;
    }
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
    isAdaptive?: boolean,
    virtualScrollRange?: ScrollControllerLib.IItemsRange
): TItemActionsCollectionsMap {
    const { MenuSource, ActionsCollection } = getActionsLib();
    const nextIASuperMap: TItemActionsCollectionsMap = new Map();

    // Коллекция списков. Вынужденная мера для того,
    // чтобы действия обновляялись по индексам виртуального скролла
    const collection = slice.state.collection;
    if (!sliceIAMap || !collection || !MenuSource || !ActionsCollection) {
        return nextIASuperMap;
    }

    collection.each((item: GridRow, index: number) => {
        const itemKey = item.key;
        const itemActions = sliceIAMap.get(itemKey);
        if (
            !itemActions ||
            (virtualScrollRange &&
                (index >= virtualScrollRange.endIndex || index < virtualScrollRange.startIndex))
        ) {
            return;
        }
        const actionData = createBaseActionDataObjectForItem(
            itemKey,
            itemActions,
            slice,
            isAdaptive
        );
        if (!actionData) {
            return;
        }
        nextIASuperMap.set(itemKey, actionData);
    });

    return nextIASuperMap;
}

// Обновляет карту данных для экшнов у каждой записи. Сравнивает карты - в слайсе и в стейте хука.
// Для удалённых записей удаляет из карты.
// Для одинаковых вызывает updateContext.
// Для новых создаёт ActionsData и добавляет в карту.
function updateItemActionsCollectionsMap(
    prevHookIASuperMap: TItemActionsCollectionsMap,
    sliceIAMap: Map<TKey, IAction[]>,
    slice: ListSlice,
    isAdaptive?: boolean,
    virtualScrollRange?: ScrollControllerLib.IItemsRange
): TItemActionsCollectionsMap | null {
    if (!sliceIAMap) {
        return null;
    }

    // Коллекция списков. Вынужденная мера для того,
    // чтобы действия обновляялись по индексам виртуального скролла
    const collection = slice.state.collection;
    if (!collection) {
        return prevHookIASuperMap;
    }

    const nextHookIASuperMap = new Map(prevHookIASuperMap);

    collection.each((item: GridRow, index: number) => {
        if (
            virtualScrollRange &&
            (index >= virtualScrollRange.endIndex || index < virtualScrollRange.startIndex)
        ) {
            return;
        }
        const itemKey = item.key;
        if (!nextHookIASuperMap.has(itemKey) && sliceIAMap.has(itemKey)) {
            const itemActions = sliceIAMap.get(itemKey);
            const actionData = createBaseActionDataObjectForItem(
                itemKey,
                itemActions,
                slice,
                isAdaptive
            );
            nextHookIASuperMap.set(itemKey, actionData);
        } else if (nextHookIASuperMap.has(itemKey)) {
            const actionsData = nextHookIASuperMap.get(itemKey);
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
        }
    });

    return nextHookIASuperMap;
}

export function useItemActionsMap(
    props: IUseItemActionsMapProps
): TItemActionsCollectionsMap | null {
    // Слайс списка
    const slice = useSlice(props.storeId) as ListSlice;
    // Стейт слайса списка
    const sliceState = slice?.state || {};
    // Текущая карта экшнов в слайсе.
    // Если она поменялась, нам надо выполнить update
    const sliceIAMap = slice.state.itemActionsMap;
    // Текущий массив раскрытых узлов
    // Если они поменялись, нам надо выполнить update
    const sliceExpandedItems = sliceState.expandedItems;
    // Определяем, что вид изменился
    const { prevViewMode } = usePreviousProps({ prevViewMode: sliceState.viewMode });
    const viewModeChanged = prevViewMode && prevViewMode !== sliceState.viewMode;
    const itemsVersion = sliceState.items?.getVersion();

    const [hookIASuperMap, setHookIASuperMap] = React.useState<TItemActionsCollectionsMap | null>(
        () =>
            createItemActionsCollectionsMap(
                sliceIAMap,
                slice,
                props.isAdaptive,
                props.virtualScrollRange
            )
    );

    React.useEffect(() => {
        let result;
        if (viewModeChanged) {
            result = createItemActionsCollectionsMap(
                sliceIAMap,
                slice,
                props.isAdaptive,
                props.virtualScrollRange
            );
        } else {
            result = updateItemActionsCollectionsMap(
                hookIASuperMap,
                sliceIAMap,
                slice,
                props.isAdaptive,
                props.virtualScrollRange
            );
        }
        setHookIASuperMap(result);
    }, [
        viewModeChanged /* Поменялся viewMode, надо ПЕРЕСОЗДАТЬ hookIASuperMap,
                           т.к. у action мог поменяться showType */,
        sliceExpandedItems /* Поменялись expandedItems, надо обновить hookIASuperMap,
                           т.к. могли создать запись в RecordSet внутри свёрнутого узла, и
                           поэтому сразу после создания она будет отсутствовать в коллекции
                           в итоге ItemActions лдя неё никто не проинициализирует */,
        itemsVersion /* поменялась версия recordSet, надо обновить itemActions, т.к. у них мог поменяться visibility */,
        slice /* Слайс используется в зависимостях как обновления, так и создания суперкарты */,
        sliceIAMap /* Т.к. карта ItemActions применяется в состояние слайса ПОСЛЕ ТОГО,
                      как происходит отрисовка, Нам нужно обновлять экшны не только при изменении items,
                      но и когда обновилась карта в слайсе. */,
        props.isAdaptive /* isAdaptive используется при инициализации коллекции ItemActions */,
        props.virtualScrollRange /* Экшны в суперкарте обновляются ТОЛЬКО по диапазону виртуального скролла,
                                     иначе происходит огромное число вычислений по карте при update,
                                     и это фатально тормозит скролл */,
    ]);

    return hookIASuperMap;
}
