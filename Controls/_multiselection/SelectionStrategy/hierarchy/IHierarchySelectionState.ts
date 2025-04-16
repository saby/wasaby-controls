import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
    TAbstractSelectionSideData,
} from '../abstract/IAbstractSelectionState';
import { Collection as IBaseCollection } from 'Controls/display';
import { Tree as ITreeCollection, TreeItem } from 'Controls/baseTree';
import { TSelectionType as TBaseSelectionType } from 'Controls/interface';
import { IListState } from 'Controls-DataEnv/list';
import { CrudEntityKey } from 'Types/source';

type ICollection = ITreeCollection & IBaseCollection;

export type TSelectionType = TBaseSelectionType | 'allBySelectAction';

export type THierarchySelectionSideData = TAbstractSelectionSideData<TreeItem> & {
    isOnlyNodesInItems: boolean;
};

export interface IEntryPathItem {
    id: CrudEntityKey;
    parent: CrudEntityKey;
}

export interface IHierarchySelectionState
    extends IAbstractSelectionState,
        Pick<
            IListState,
            | 'root'
            | 'parentProperty'
            | 'nodeProperty'
            | 'keyProperty'
            | 'items'
            | 'declaredChildrenProperty'
            | 'recursiveSelection'
            | 'selectionType'
            | 'selectAncestors'
            | 'selectDescendants'
        > {
    /**
     * Берется из поля ENTRY_PATH метаданных коллекции.
     * */
    entryPath?: IEntryPathItem[];
    collection: ICollection | IBaseCollection;
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
    parentProperty,
    declaredChildrenProperty,
    nodeProperty,
    keyProperty,
    items,
    ...state
}: IHierarchySelectionState): IHierarchySelectionState {
    return {
        keyProperty,
        items,
        parentProperty,
        declaredChildrenProperty,
        nodeProperty,
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
