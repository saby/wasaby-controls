/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListAction as TNewListAction } from 'Controls-DataEnv/list';

import { TStateActions } from '../actions/state';
import { TBeforeApplyStateActions } from '../actions/beforeApplyState';
import { TSourceActions } from '../actions/source';
import { TFilterActions } from '../actions/filter';

export type TListAction =
    | TNewListAction
    | TStateActions
    | TBeforeApplyStateActions
    | TSourceActions
    | TFilterActions;

/**
 * actions.ts
 * ListActionsCreators.marker.setMarker(1)
 * TListActions.marker.TSetMarker
 */
