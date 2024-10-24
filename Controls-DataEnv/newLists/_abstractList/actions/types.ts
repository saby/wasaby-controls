import type * as marker from './types/marker';
import type * as operationsPanel from './types/operationsPanel';
import type * as root from './types/root';
import type * as search from './types/search';
import type * as selection from './types/selection';
import type * as source from './types/source';
import type * as expandCollapse from './types/expandCollapse';
import type * as filter from './types/filter';

import type * as interactorCore from './types/interactorCore';

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
};

/**
 * Тип действия, доступного в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyAbstractAction =
    | source.TAnySourceAction
    | expandCollapse.TAnyExpandCollapseAction
    | marker.TAnyMarkerAction
    | filter.TAnyFilterAction
    | selection.TAnySelectionAction
    | operationsPanel.TAnyOperationsPanelAction
    | root.TAnyRootAction
    | search.TAnySearchAction
    | interactorCore.TAnyInteractorCoreAction;
