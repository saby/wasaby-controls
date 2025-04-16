import type { CrudEntityKey } from 'Types/source';
import type { IListState } from 'Controls-DataEnv/list';

export type TSelectionModelStatus = boolean | null;
export type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

export type TAbstractSelectionSideData<TCollectionItem> = {
    data: Map<CrudEntityKey, TCollectionItem>;
};

export interface IAbstractSelectionState
    extends Pick<
        IListState,
        | 'selectionModel'
        | 'selectedKeys'
        | 'excludedKeys'
        | 'collection'
        | 'multiSelectAccessibilityProperty'
    > {
    isMassSelectMode?: boolean;
    count: number | null;
}

export function copyAbstractSelectionState({
    selectedKeys,
    excludedKeys,
    selectionModel,
    isMassSelectMode,
    collection,
    selectedKeysCount,
    multiSelectAccessibilityProperty,
}: IAbstractSelectionState): IAbstractSelectionState {
    return {
        isMassSelectMode,
        collection,
        multiSelectAccessibilityProperty,
        selectedKeysCount,
        selectedKeys: [...selectedKeys],
        excludedKeys: [...excludedKeys],
        selectionModel: new Map(selectionModel),
    };
}
