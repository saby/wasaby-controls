import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import type * as marker from './types/marker';
import type * as operationsPanel from './types/operationsPanel';
import type * as selection from './types/selection';
import type * as items from './types/items';
import type * as filter from './types/filter';
import type * as source from './types/source';
import type * as expandCollapse from './types/expandCollapse';
import type * as complexUpdate from './types/complexUpdate';
import type * as error from './types/error';

import type { IListState } from '../interface/IListState';

export type {
    marker,
    operationsPanel,
    expandCollapse,
    selection,
    items,
    filter,
    source,
    complexUpdate,
    error,
};

/**
 * Тип действия, доступного в WEB списке.
 */
export type TAnyListAction<TState extends IListState = IListState> =
    | TAbstractListActions.TAnyAbstractListAction<TState>
    | expandCollapse.TAnyExpandCollapseAction
    | marker.TAnyMarkerAction
    | selection.TAnySelectionAction
    | operationsPanel.TAnyOperationsPanelAction
    | items.TAnyItemsAction
    | source.TAnySourceAction
    | filter.TAnyFilterAction
    | complexUpdate.TAnyComplexUpdateAction
    | error.TAnyHandleLoadErrorAction;
