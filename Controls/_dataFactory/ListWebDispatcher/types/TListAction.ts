import { TStateActions } from '../actions/state';
import { TBeforeApplyStateActions } from '../actions/beforeApplyState';
import { TOperationsPanelActions } from '../actions/operationsPanel';
import { TSelectionActions } from '../actions/selection';
import { TMarkerActions } from '../actions/marker';
import { TReloadActions } from '../actions/reload';

export type TListAction =
    | TStateActions
    | TBeforeApplyStateActions
    | TOperationsPanelActions
    | TSelectionActions
    | TMarkerActions
    | TReloadActions;
