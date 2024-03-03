import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
    TSelectionModel,
    TSelectionModelStatus,
} from './IAbstractSelectionState';
import { isEqual } from 'Types/object';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

export function isEqualSelectionModel(
    selectionA: IAbstractSelectionState['selectionModel'],
    selectionB: IAbstractSelectionState['selectionModel']
): boolean {
    return isEqual(Array.from(selectionA.entries()), Array.from(selectionB.entries()));
}

export function getSelectionModelsDifference(
    prevSelectionModel: TSelectionModel,
    nextSelectionModel: TSelectionModel
) {
    const PREV_STATUS_ALIAS = 'prev';
    const NEXT_STATUS_ALIAS = 'next';

    const prevToNextModel = new Map<
        CrudEntityKey,
        {
            prev?: TSelectionModelStatus;
            next?: TSelectionModelStatus;
        }
    >();

    const fill = (
        pairs: [CrudEntityKey, boolean | null][],
        index: number,
        fieldName: typeof PREV_STATUS_ALIAS | typeof NEXT_STATUS_ALIAS
    ) => {
        if (index < pairs.length) {
            const [key, value] = pairs[index];
            if (!prevToNextModel.has(key)) {
                prevToNextModel.set(key, {
                    [PREV_STATUS_ALIAS]: undefined,
                    [NEXT_STATUS_ALIAS]: undefined,
                });
            }
            // ts не понимает, что объект точно создан.
            // @ts-ignore
            prevToNextModel.get(key)[fieldName] = value;
        }
    };

    const prevSelectionModelEntries: [CrudEntityKey, boolean | null][] = [
        ...prevSelectionModel.entries(),
    ];
    const nextSelectionModelEntries: [CrudEntityKey, boolean | null][] = [
        ...nextSelectionModel.entries(),
    ];

    for (
        let i = 0;
        i < Math.max(prevSelectionModelEntries.length, nextSelectionModelEntries.length);
        i++
    ) {
        fill(prevSelectionModelEntries, i, PREV_STATUS_ALIAS);
        fill(nextSelectionModelEntries, i, NEXT_STATUS_ALIAS);
    }

    const clearChanges: TSelectionModel = new Map();
    prevToNextModel.forEach((value, key) => {
        if (value[PREV_STATUS_ALIAS] !== value[NEXT_STATUS_ALIAS]) {
            const nextStatus = value[NEXT_STATUS_ALIAS];
            clearChanges.set(key, typeof nextStatus === 'undefined' ? false : nextStatus);
        }
    });
    return clearChanges;
}

export function getKey(item: unknown): CrudEntityKey | undefined {
    if (!item) {
        return undefined;
    }

    let contents = (item as CollectionItem<Model>).getContents();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item['[Controls/_baseTree/BreadcrumbsItem]'] || item.breadCrumbs) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        contents = contents[(contents as any).length - 1];
    }

    // Для GroupItem нет ключа, в contents хранится не Model
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item['[Controls/_display/GroupItem]']) {
        return undefined;
    }

    // у корневого элемента contents=key
    return contents instanceof Object ? contents.getKey() : contents;
}

export const ALL_SELECTION_VALUE = null;

export function isAllSelected(state: IAbstractSelectionState): boolean {
    return state.selectedKeys.includes(ALL_SELECTION_VALUE);
}

export function unselectAll(
    state: IAbstractSelectionState,
    filter?: object
): IAbstractSelectionState {
    const nextState = copyAbstractSelectionState(state);

    if (
        filter &&
        isAllSelected(nextState) &&
        !nextState.collection.hasMoreData()
    ) {
        nextState.collection.getItems().forEach((it) => {
            if (!it.SelectableItem) {
                return;
            }
            ArraySimpleValuesUtil.addSubArray(nextState.excludedKeys, [it.key]);
        });
        return nextState;
    }

    return {
        ...nextState,
        selectedKeys: [],
        excludedKeys: [],
    };
}
