import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

export const FirstItemKeySymbol = Symbol('FirstItemInRecordSetKey');

const TInternalListChange = 'INTERNAL';
const TExternalListChange = 'EXTERNAL';
export type TListChangeSource = typeof TInternalListChange | typeof TExternalListChange;

export const ListChangeSourceEnum = {
    INTERNAL: 'INTERNAL',
    EXTERNAL: 'EXTERNAL',
} as const;

export const RemoveItemsChangeName = 'REMOVE_ITEMS';
export type TRemoveItemsChangeName = typeof RemoveItemsChangeName;

/* Удалить элементы по указанным ключам */
export interface IRemoveItemsChange {
    name: TRemoveItemsChangeName;
    args: {
        keys: CrudEntityKey[];
        changeSource: TListChangeSource;
    };
}

export const PrependItemsChangeName = 'PREPEND_ITEMS';
export type TPrependItemsChangeName = typeof PrependItemsChangeName;

/* Добавить элементы перед указанными ключами */
export interface IPrependItemsChange {
    name: TPrependItemsChangeName;
    args: {
        items: Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>;
        changeSource: TListChangeSource;
    };
}

export const AppendItemsChangeName = 'APPEND_ITEMS';
export type TAppendItemsChangeName = typeof AppendItemsChangeName;

/* Добавить элементы после указанных ключей */
export interface IAppendItemsChange {
    name: TAppendItemsChangeName;
    args: {
        items: Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>;
        changeSource: TListChangeSource;
    };
}

export const ReplaceItemsChangeName = 'REPLACE_ITEMS';
export type TReplaceItemsChangeName = typeof ReplaceItemsChangeName;

/* Заменить элементы по указанным ключам */
export interface IReplaceItemsChange {
    name: TReplaceItemsChangeName;
    args: {
        items: Map<CrudEntityKey, Model>;
        changeSource: TListChangeSource;
    };
}

export const ReplaceAllItemsChangeName = 'REPLACE_ALL_ITEMS';
export type TReplaceAllItemsChangeName = typeof ReplaceAllItemsChangeName;

/* Заменить все элементы */
export interface IReplaceAllItemsChange {
    name: TReplaceAllItemsChangeName;
    args: {
        items: RecordSet<Record<string, unknown>>;
    };
}

/* Обновить метаданные */
export interface IMergeMetaData {
    name: TMergeMetaDataChangeName;
    args: {
        metaData: unknown;
    };
}

export const MergeMetaDataChangeName = 'MERGE_META_DATA';
export type TMergeMetaDataChangeName = typeof MergeMetaDataChangeName;

/* Заменить метаданные */
export interface IReplaceMetaData {
    name: TReplaceMetaDataChangeName;
    args: {
        metaData: unknown;
    };
}

export const ReplaceMetaDataChangeName = 'REPLACE_META_DATA';
export type TReplaceMetaDataChangeName = typeof ReplaceMetaDataChangeName;

/* Изменения записей */
export type TItemsChanges =
    /* Добавить элементы перед указанными ключами */
    | IPrependItemsChange
    /* Добавить элементы после указанных ключей */
    | IAppendItemsChange
    /* Удалить элементы по указанным ключам */
    | IRemoveItemsChange
    /* Заменить элементы по указанным ключам */
    | IReplaceItemsChange
    /* Заменить все элементы */
    | IReplaceAllItemsChange
    /* Заменить метаданные */
    | IReplaceMetaData
    /* Обновить метаданные */
    | IMergeMetaData;
