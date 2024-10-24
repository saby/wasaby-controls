/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ActionsNames } from '../ActionsNames';
import { rpcEvents } from '../types';
import { TRawStompEvent } from '../../_interface/IExternalTypes';

export const receiveEventGroup = (event: TRawStompEvent): rpcEvents.TReceiveEventGroupAction => ({
    type: ActionsNames.RECEIVE_EVENT_GROUP,
    payload: {
        event,
    },
});
