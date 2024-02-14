import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';
import type { Path } from 'Controls/dataSource';
import type { FirstItemKeySymbol } from '../aspects/Items/ItemsStateManager';

export enum IListChangeName {
    REMOVE_ITEMS = 'REMOVE_ITEMS',
    REPLACE_ITEMS = 'REPLACE_ITEMS',
    REPLACE_ALL_ITEMS = 'REPLACE_ALL_ITEMS',
    PREPEND_ITEMS = 'PREPEND_ITEMS',
    APPEND_ITEMS = 'APPEND_ITEMS',
    EXPAND = 'EXPAND',
    COLLAPSE = 'COLLAPSE',
    CHANGE_ROOT = 'CHANGE_ROOT',
    REPLACE_PATH = 'REPLACE_PATH',
    MOVE_MARKER = 'MOVE_MARKER',
    SET_SELECTED = 'SET_SELECTED',
}

export enum IListChangeSource {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL',
}

export type IListChange =
    /* Добавить элементы перед указанными ключами */
    | {
          name: IListChangeName.PREPEND_ITEMS;
          args: {
              items: Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>;
              changeSource: IListChangeSource;
          };
      }
    /* Добавить элементы после указанных ключей */
    | {
          name: IListChangeName.APPEND_ITEMS;
          args: {
              items: Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>;
              changeSource: IListChangeSource;
          };
      }
    /* Удалить элементы по указанным ключам */
    | {
          name: IListChangeName.REMOVE_ITEMS;
          args: {
              keys: CrudEntityKey[];
              changeSource: IListChangeSource;
          };
      }
    /* Заменить элементы по указанным ключам */
    | {
          name: IListChangeName.REPLACE_ITEMS;
          args: {
              items: Map<CrudEntityKey, Model>;
              changeSource: IListChangeSource;
          };
      }
    /* Заменить все элементы */
    | {
          name: IListChangeName.REPLACE_ALL_ITEMS;
          args: {
              items: RecordSet<Model>;
          };
      }
    /* Изменить root */
    | {
          name: IListChangeName.CHANGE_ROOT;
          args: {
              key: CrudEntityKey;
          };
      }
    /* Заменить путь в метаданных (для хлебных крошек) */
    | {
          name: IListChangeName.REPLACE_PATH;
          args: {
              path: Path;
          };
      }
    /* Переместить маркер */
    | {
          name: IListChangeName.MOVE_MARKER;
          args: {
              from?: CrudEntityKey | undefined;
              to?: CrudEntityKey | undefined;
          };
      }
    /* Установить выделение по набору ключей */
    | {
          name: IListChangeName.SET_SELECTED;
          args: {
              selections: Map<CrudEntityKey, boolean | null>;
          };
      }
    /* Развернуть узлы по переданными ключам */
    | {
          name: IListChangeName.EXPAND;
          args: {
              keys: CrudEntityKey[];
          };
      }
    /* Свернуть узлы по переданным ключам */
    | {
          name: IListChangeName.COLLAPSE;
          args: {
              keys: CrudEntityKey[];
          };
      };

export type IListChangeByName<
    TName extends IListChangeName,
    T extends IListChange = IListChange
> = T extends {
    name: TName;
    args: infer R;
}
    ? { name: TName; args: R }
    : never;
