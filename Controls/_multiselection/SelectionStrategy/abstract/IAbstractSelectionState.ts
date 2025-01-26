import type { CrudEntityKey } from 'Types/source';
import type { IListState } from 'Controls-DataEnv/list';

export type TSelectionModelStatus = boolean | null;
export type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

export interface IAbstractSelectionState
    extends Pick<IListState, 'selectionModel' | 'selectedKeys' | 'excludedKeys' | 'collection'> {
    isMassSelectMode?: boolean;
    multiSelectAccessibilityProperty?: string;
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
