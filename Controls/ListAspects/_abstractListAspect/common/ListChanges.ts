import type { CrudEntityKey } from 'Types/source';
import type { Path } from 'Controls/dataSource';
import type { TSelectionChanges } from 'Controls/abstractSelectionAspect';
import type { TExpandCollapseChanges } from 'Controls/expandCollapseListAspect';
import type { TItemsChanges } from 'Controls/itemsListAspect';
import type { TMarkerChanges } from 'Controls/markerListAspect';

const SET_SELECTED: TSelectionChanges['name'] = 'SET_SELECTED';
const EXPAND: TExpandCollapseChanges['name'] = 'EXPAND';
const COLLAPSE: TExpandCollapseChanges['name'] = 'COLLAPSE';

const REMOVE_ITEMS: TItemsChanges['name'] = 'REMOVE_ITEMS';
const REPLACE_ITEMS: TItemsChanges['name'] = 'REPLACE_ITEMS';
const REPLACE_ALL_ITEMS: TItemsChanges['name'] = 'REPLACE_ALL_ITEMS';
const PREPEND_ITEMS: TItemsChanges['name'] = 'PREPEND_ITEMS';
const APPEND_ITEMS: TItemsChanges['name'] = 'APPEND_ITEMS';
const REPLACE_META_DATA: TItemsChanges['name'] = 'REPLACE_META_DATA';
const MERGE_META_DATA: TItemsChanges['name'] = 'MERGE_META_DATA';
const MOVE_MARKER: TMarkerChanges['name'] = 'MOVE_MARKER';
const CHANGE_MARKER_VISIBILITY: TMarkerChanges['name'] = 'CHANGE_MARKER_VISIBILITY';

export const ListChangeNameEnum = {
    /* Изменения записей */
    REMOVE_ITEMS,
    REPLACE_ITEMS,
    REPLACE_ALL_ITEMS,
    PREPEND_ITEMS,
    APPEND_ITEMS,

    /* Изменение метаданных */
    REPLACE_META_DATA,
    MERGE_META_DATA,

    /* Свернуть/развернуть узлы по переданными ключам */
    EXPAND,
    COLLAPSE,

    /* Установить выделение по набору ключей */
    SET_SELECTED,

    /* Переместить маркер/изменить его видимость */
    MOVE_MARKER,
    CHANGE_MARKER_VISIBILITY,

    /* TODO: Аналогично разнести при реализации аспектов */
    CHANGE_ROOT: 'CHANGE_ROOT',
    SET_HAS_MORE: 'SET_HAS_MORE',
    REPLACE_PATH: 'REPLACE_PATH',
} as const;


export type IListChange =
    /* Изменения записей */
    | TItemsChanges
    /* Изменить root */
    | {
          name: typeof ListChangeNameEnum.CHANGE_ROOT;
          args: {
              key: CrudEntityKey | null;
          };
      }
    /* Заменить путь в метаданных (для хлебных крошек) */
    | {
          name: typeof ListChangeNameEnum.REPLACE_PATH;
          args: {
              path: Path;
          };
      }
    /* Переместить маркер/изменить его видимость */
    | TMarkerChanges
    /* Установить выделение по набору ключей */
    | TSelectionChanges
    /* Свернуть/развернуть узлы по переданными ключам */
    | TExpandCollapseChanges;

export type IGetListChangeByName<
    TName extends keyof typeof ListChangeNameEnum,
    T extends IListChange = IListChange
> = T extends {
    name: TName;
    args: infer R;
}
    ? { name: TName; args: R }
    : never;
