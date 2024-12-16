import type * as marker from './types/marker';
import type * as operationsPanel from './types/operationsPanel';
import type * as root from './types/root';
import type * as search from './types/search';
import type * as selection from './types/selection';
import type * as source from './types/source';
import type * as expandCollapse from './types/expandCollapse';
import type * as filter from './types/filter';
import type * as highlightFields from './types/highlightFields';
import type * as complexUpdate from './types/complexUpdate';
import type * as itemActions from './types/itemActions';
import type * as items from './types/items';
import type * as breadCrumbs from './types/breadCrumbs';

import type * as interactorCore from './types/interactorCore';
import type { IAbstractListState } from '../interface/IAbstractListState';

export type {
    marker,
    operationsPanel,
    root,
    search,
    selection,
    source,
    expandCollapse,
    filter,
    interactorCore,
    highlightFields,
    complexUpdate,
    itemActions,
    items,
    breadCrumbs,
};

/**
 * Тип действия, доступного в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyAbstractAction<TState extends IAbstractListState = IAbstractListState> =
    | source.TAnySourceAction
    | expandCollapse.TAnyExpandCollapseAction
    | marker.TAnyMarkerAction
    | filter.TAnyFilterAction
    | selection.TAnySelectionAction
    | breadCrumbs.TAnyBreadCrumbsAction
    | operationsPanel.TAnyOperationsPanelAction
    | root.TAnyRootAction
    | search.TAnySearchAction
    | interactorCore.TAnyInteractorCoreAction
    | highlightFields.TAnyHighlightFieldsAction
    | itemActions.TAnyItemActionsAction
    | items.TAnyItemsAction
    | complexUpdate.TAnyComplexUpdateAction<TState>;
