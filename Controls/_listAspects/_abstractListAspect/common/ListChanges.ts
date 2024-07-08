import type { CrudEntityKey } from 'Types/source';
import type { Path } from 'Controls/dataSource';
import type { TSelectionChanges } from '../../selection/_abstractSelectionAspect/TSelectionChanges';
import type { TOperationsPanelChanges } from '../../_operationsPanelListAspect/TOperationsPanelChanges';
import type { TMarkerChanges } from '../../_markerListAspect/TMarkerChanges';
import type { TItemsChanges } from '../../_itemsListAspect/TItemsChanges';
import type { TStubChanges } from '../../_stubListAspect/TSStubChanges';
import type { THighlightFieldsChanges } from '../../_highlightFieldsListAspect/THighlightFieldsChanges';
import type { TExpandCollapseChanges } from '../../_expandCollapseListAspect/TExpandCollapseChanges';
import { TItemActionsChanges } from '../../_itemActionsListAspect/TItemActionsChanges';

const SET_SELECTION_OBJECT: TSelectionChanges['name'] = 'SET_SELECTION_OBJECT';
const SET_SELECTION_MAP: TSelectionChanges['name'] = 'SET_SELECTION_MAP';
const EXPAND: TExpandCollapseChanges['name'] = 'EXPAND';
const COLLAPSE: TExpandCollapseChanges['name'] = 'COLLAPSE';
const SET_EXPANSION_MODEL: TExpandCollapseChanges['name'] = 'SET_EXPANSION_MODEL';

const REMOVE_ITEMS: TItemsChanges['name'] = 'REMOVE_ITEMS';
const REPLACE_ITEMS: TItemsChanges['name'] = 'REPLACE_ITEMS';
const REPLACE_ALL_ITEMS: TItemsChanges['name'] = 'REPLACE_ALL_ITEMS';
const PREPEND_ITEMS: TItemsChanges['name'] = 'PREPEND_ITEMS';
const APPEND_ITEMS: TItemsChanges['name'] = 'APPEND_ITEMS';
const REPLACE_META_DATA: TItemsChanges['name'] = 'REPLACE_META_DATA';
const MERGE_META_DATA: TItemsChanges['name'] = 'MERGE_META_DATA';
const MOVE_MARKER: TMarkerChanges['name'] = 'MOVE_MARKER';
const CHANGE_MARKER_VISIBILITY: TMarkerChanges['name'] = 'CHANGE_MARKER_VISIBILITY';
const CHANGE_HIGHLIGHTED_FIELDS: THighlightFieldsChanges['name'] = 'HIGHLIGHTED_FIELDS_CHANGE';
const CHANGE_ITEM_ACTIONS: TItemActionsChanges['name'] = 'ITEM_ACTIONS_CHANGE';
const ADD_STUB: TStubChanges['name'] = 'ADD_STUB';
const REMOVE_STUB: TStubChanges['name'] = 'REMOVE_STUB';

const CHANGE_OPERATIONS_PANEL_VISIBILITY: TOperationsPanelChanges['name'] =
    'OPERATIONS_PANEL_VISIBILITY_CHANGE';

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

    /* Установить разворот узлов по набору ключей */
    SET_EXPANSION_MODEL,

    /* Установить выделение по набору ключей */
    SET_SELECTION_OBJECT,
    SET_SELECTION_MAP,

    /* Переместить маркер/изменить его видимость */
    MOVE_MARKER,
    CHANGE_MARKER_VISIBILITY,

    /* TODO: Аналогично разнести при реализации аспектов */
    CHANGE_ROOT: 'CHANGE_ROOT',
    SET_HAS_MORE: 'SET_HAS_MORE',
    REPLACE_PATH: 'REPLACE_PATH',

    CHANGE_OPERATIONS_PANEL_VISIBILITY,

    CHANGE_HIGHLIGHTED_FIELDS,

    CHANGE_ITEM_ACTIONS,
    ADD_STUB,
    REMOVE_STUB,
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
    | TExpandCollapseChanges
    | TOperationsPanelChanges
    | THighlightFieldsChanges
    | TItemActionsChanges
    | TStubChanges;

export type IGetListChangeByName<
    TName extends
        | keyof typeof ListChangeNameEnum
        | (typeof ListChangeNameEnum)[keyof typeof ListChangeNameEnum],
    T extends IListChange = IListChange
> = T extends {
    name: TName;
    args: infer R;
}
    ? { name: TName; args: R }
    : never;
