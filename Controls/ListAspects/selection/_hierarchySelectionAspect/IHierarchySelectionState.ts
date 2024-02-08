import { IStateWithHierarchyItems, copyStateWithHierarchyItems } from 'Controls/abstractListAspect';
import type { IRootState } from 'Controls/rootListAspect';
import {
    IAbstractSelectionState,
    copyAbstractSelectionState,
} from 'Controls/abstractSelectionAspect';
import { CrudEntityKey } from 'Types/source';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Collection as IBaseCollection } from 'Controls/display';
import { Tree as ITreeCollection } from 'Controls/baseTree';
import { TSelectionType as TBaseSelectionType } from 'Controls/interface';

type ICollection = ITreeCollection & IBaseCollection;

export type TSelectionType = TBaseSelectionType | 'allBySelectAction';

export interface IEntryPathItem {
    id: CrudEntityKey;
    parent: CrudEntityKey;
}

export interface IHierarchySelectionState
    extends IAbstractSelectionState,
        IStateWithHierarchyItems,
        Partial<Omit<IRootState, keyof IStateWithHierarchyItems>> {
    entryPath?: IEntryPathItem[];
    recursiveSelection?: boolean;
    selectionType?: TSelectionType;
    selectAncestors?: boolean;
    selectDescendants?: boolean;
    collection: ICollection;
}

// TODO: Прописать правила, что можно делать тут, а что нельзя.
//  Судя по всему, сейчас допущена ошибка - неправильное наследование и копирование стейта в наследниках.
//  Нельзя копировать стейт родителя в наследниках, например hSelection знает про root, пользуется им,
//  но копировать права не имеет. Не имеет, потому что сам аспект root'a может этот root поменять,
//  а наш аспект его перетрет.
export function copyHierarchySelectionState({
    entryPath,
    recursiveSelection,
    selectAncestors,
    selectDescendants,
    selectionType,
    ...state
}: IHierarchySelectionState): IHierarchySelectionState {
    return {
        ...copyStateWithHierarchyItems(state),
        ...copyAbstractSelectionState(state),
        selectionType,
        collection: state.collection,
        // Не копируем, это особый костыль, который пока модифицируется прямо по ссылке
        entryPath,
        recursiveSelection,
        selectAncestors,
        selectDescendants,
    };
}
