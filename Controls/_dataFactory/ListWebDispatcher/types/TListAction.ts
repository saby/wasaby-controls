/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TStateActions } from '../actions/state';
import { TBeforeApplyStateActions } from '../actions/beforeApplyState';
import { TOperationsPanelActions } from '../actions/operationsPanel';
import { TSelectionActions } from '../actions/selection';
import { TMarkerActions } from '../actions/marker';
import { TSourceActions } from '../actions/source';
import { TSearchActions } from '../actions/search';
import { TFilterActions } from '../actions/filter';
import { TRootActions } from '../actions/root';

export type TListAction =
    | TStateActions
    | TBeforeApplyStateActions
    | TOperationsPanelActions
    | TSelectionActions
    | TMarkerActions
    | TSourceActions
    | TSearchActions
    | TFilterActions
    | TRootActions;
