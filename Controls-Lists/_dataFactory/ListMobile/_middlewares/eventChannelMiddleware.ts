import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import type { IStompEventGroupListener } from '../_interface/IExternalTypes';

import { IListMobileActionType } from '../_interface/IListMobileTypes';
import * as actions from '../_actions';

export const eventChannelMiddleware: IListMobileMiddleware = ({ dispatch, sourceController }) => {
    const onEventGroup: IStompEventGroupListener = (_, { events, errors, requestId }) => {
        dispatch(actions.receiveEventGroup(events, errors, requestId));
    };
    return (next) => (action) => {
        switch (action.type) {
            case IListMobileActionType.CONNECT: {
                sourceController.subscribe('receiveEventGroup', onEventGroup);
                dispatch(actions.openEventChannelStart());
                sourceController
                    .connect()
                    .then(() => dispatch(actions.openEventChannelSuccess()))
                    .catch((error) => dispatch(actions.openEventChannelFail(error)));
                break;
            }
            case IListMobileActionType.DISCONNECT: {
                sourceController.unsubscribe('receiveEventGroup', onEventGroup);
                dispatch(actions.closeEventChannelStart());
                sourceController
                    .disconnect()
                    .then(() => dispatch(actions.closeEventChannelSuccess()))
                    .catch((error) => dispatch(actions.closeEventChannelFail(error)));
                break;
            }
        }

        next(action);
    };
};
