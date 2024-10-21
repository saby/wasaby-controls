import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { TRawStompEvent } from '../../_interface/IExternalTypes';
import { ActionsNames } from '../ActionsNames';

export type TReceiveEventGroupAction = TAbstractAction<
    ActionsNames.RECEIVE_EVENT_GROUP,
    {
        event: TRawStompEvent;
    }
>;

export type TAnyRpcEventsAction = TReceiveEventGroupAction;
