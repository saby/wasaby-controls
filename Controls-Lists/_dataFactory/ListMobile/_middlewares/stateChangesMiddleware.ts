import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';

import { IListChangeName } from 'Controls/dataFactory';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import * as actions from '../_actions';

export const stateChangesMiddleware: IListMobileMiddleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        if (action.type === IListMobileActionType.REGISTER_STATE_CHANGES) {
            for (const { name, args } of action.payload.changes) {
                switch (name) {
                    case IListChangeName.MOVE_MARKER: {
                        dispatch(actions.mark(args.to));
                        break;
                    }
                    case IListChangeName.SET_SELECTED: {
                        args.selections.forEach((_, key) => {
                            dispatch(actions.select(key));
                        });
                        break;
                    }
                }
            }
        }

        next(action);
    };
