import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import type * as marker from './types/marker';
import type * as operationsPanel from './types/operationsPanel';
import type * as root from './types/root';
import type * as search from './types/search';
import type * as selection from './types/selection';
import type * as items from './types/items';
import type * as filter from './types/filter';
import type * as source from './types/source';
import type * as expandCollapse from './types/expandCollapse';
import type * as itemActions from './types/itemActions';
import type * as complexUpdate from './types/complexUpdate';
import type * as stub from './types/stub';

import type { IListState } from '../interface/IListState';

export type {
    marker,
    operationsPanel,
    root,
    expandCollapse,
    search,
    selection,
    items,
    filter,
    source,
    complexUpdate,
    itemActions,
    stub,
};

/**
 * Тип действия, доступного в WEB списке.
 */
export type TAnyListAction<TState extends IListState = IListState> =
    | TAbstractListActions.TAnyAbstractAction<TState>
    | expandCollapse.TAnyExpandCollapseAction
    | marker.TAnyMarkerAction
    | selection.TAnySelectionAction
    | operationsPanel.TAnyOperationsPanelAction
    | root.TAnyRootAction
    | search.TAnySearchAction
    | items.TAnyItemsAction
    | source.TAnySourceAction
    | filter.TAnyFilterAction
    | complexUpdate.TAnyComplexUpdateAction
    | itemActions.TAnyItemActionsAction
    | stub.TAnyStubAction;
