import { TKeysSelection } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';

export type TSelectionModelStatus = boolean | null;
export type TSelectionModel = Map<CrudEntityKey, TSelectionModelStatus>;

export interface IAbstractSelectionState {
    // В карте именно CrudEntityKey, там не должно быть спецзначений
    selectionModel: TSelectionModel;
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    isMassSelectMode?: boolean;
    multiSelectAccessibilityProperty?: string;

    // FIXME
    collection: ICollection;
}

export function copyAbstractSelectionState({
    selectedKeys,
    excludedKeys,
    selectionModel,
    isMassSelectMode,
    collection,
    multiSelectAccessibilityProperty,
}: IAbstractSelectionState): IAbstractSelectionState {
    return {
        isMassSelectMode,
        collection,
        multiSelectAccessibilityProperty,
        selectedKeys: [...selectedKeys],
        excludedKeys: [...excludedKeys],
        selectionModel: new Map(selectionModel),
    };
}