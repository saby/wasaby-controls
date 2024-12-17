/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import * as actions from '../_actions';
import {
    IRawStompEventByType,
    IStompEventListener,
    StompEventType,
    TRawAtomicStompEvent,
    TRawBatchedStompEvent,
    TRawStompEvent,
    TUIEvent,
} from '../_interface/IExternalTypes';

export const eventChannelMiddleware: IListMobileMiddleware = ({ dispatch, sourceController }) => {
    const onEventGroup: IStompEventListener = (_, event) => {
        const uiEvents = getUIEventsFromStomp(event);
        uiEvents.forEach((e) => {
            dispatch(actions.receiveEvent(e));
        });
    };

    return (next) => (action) => {
        switch (action.type) {
            case IListMobileActionType.CONNECT: {
                sourceController.subscribe('receiveEvent', onEventGroup);
                dispatch(actions.openEventChannelStart());
                sourceController
                    .connect()
                    .then(() => dispatch(actions.openEventChannelSuccess()))
                    .catch((error) => dispatch(actions.openEventChannelFail(error)));
                break;
            }
            case IListMobileActionType.DISCONNECT: {
                sourceController.unsubscribe('receiveEvent', onEventGroup);
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

function getUIEventsFromStomp(event: TRawStompEvent): TUIEvent[] {
    const events: TUIEvent[] = [];

    if (event.get('method') === StompEventType.OnBatchedUpdate) {
        (event as TRawBatchedStompEvent)
            .get('data')
            .get('batch')
            .forEach((e) => {
                events.push(convertAtomicEvent(e));
            });
    } else {
        events.push(convertAtomicEvent(event as TRawAtomicStompEvent));
    }

    return events;
}

const convertAtomicEvent = (e: TRawAtomicStompEvent): TUIEvent => {
    const type = e.get('method');
    const observerId = e.get('obj_id');
    const requestId = e.get('call_id');
    let args;

    switch (type) {
        case StompEventType.OnReset:
            args = (e as IRawStompEventByType<StompEventType.OnReset>).get('data').get('items');
            break;
        case StompEventType.OnPath:
            args = (e as IRawStompEventByType<StompEventType.OnPath>).get('data').get('path');
            break;
        case StompEventType.OnReplace:
        case StompEventType.OnAdd:
            args = (e as IRawStompEventByType<StompEventType.OnReplace>).get('data').get('param');
            break;
        case StompEventType.OnRemove:
            args = (e as IRawStompEventByType<StompEventType.OnRemove>).get('data').get('index');
            break;
        case StompEventType.OnMark:
            const marked = (e as IRawStompEventByType<StompEventType.OnMark>)
                .get('data')
                .get('marked');
            args = {
                disable: marked.get('disable'),
                enable: marked.get('enable'),
            };
            break;
        case StompEventType.OnSelect:
            const data = (e as IRawStompEventByType<StompEventType.OnSelect>).get('data');
            const selected: [number, number][] = [];

            data.get('selected').forEach((i) => {
                selected.push([i.get('pos'), i.get('status')]);
            });

            args = {
                selected,
                size: data.get('counter').get('size'),
            };
            break;
        case StompEventType.End:
            const more = (e as IRawStompEventByType<StompEventType.End>)
                .get('data')
                .get('have_more');

            args = {
                forward: more.get('forward'),
                backward: more.get('backward'),
            };
            break;
        default:
            args = e.get('data');
            break;
    }

    return {
        type,
        args,
        observerId,
        requestId,
    };
};
