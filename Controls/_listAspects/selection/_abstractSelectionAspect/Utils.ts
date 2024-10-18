import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { copyAbstractSelectionState, IAbstractSelectionState } from './IAbstractSelectionState';
import { isEqual } from 'Types/object';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

export function isEqualSelectionModel(
    selectionA: IAbstractSelectionState['selectionModel'],
    selectionB: IAbstractSelectionState['selectionModel']
): boolean {
    return isEqual(Array.from(selectionA.entries()), Array.from(selectionB.entries()));
}

export function getKey(item: unknown): CrudEntityKey | undefined {
    if (!item) {
        return undefined;
    }

    // У добавляемой записи ключ CollectionItem'a с префиксом "adding-", не такой, как у модели.
    // В противном случае добавляемая запись с ключом null будет конфликтовать с корнем.
    // Список позволяет запускать редактирование записи с ключом null, но не позволяет сохранять ее.
    if ((item as CollectionItem<Model>).isAdd) {
        return (item as CollectionItem<Model>).key;
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

export function isAllSelected(state: Pick<IAbstractSelectionState, 'selectedKeys'>): boolean {
    return state.selectedKeys.includes(ALL_SELECTION_VALUE);
}

export function unselectAll(
    state: IAbstractSelectionState,
    filter?: object
): IAbstractSelectionState {
    const nextState = copyAbstractSelectionState(state);

    if (filter && isAllSelected(nextState) && !nextState.collection.hasMoreData()) {
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
