/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import { ListMobileActionsNames } from '../actions';
import {
    IRawStompEventByType,
    StompEventType,
    TRawAtomicStompEvent,
    TRawBatchedStompEvent,
    TRawStompEvent,
    TUIEvent,
} from '../_interface/IExternalTypes';

/**
 * Middleware-функция, обрабатывающая события удаленного источника.
 * Здесь идет обработка всех событий мобильного контроллера.
 */
export const rpcEventsMiddleware: TListMobileMiddleware = (ctx) => (next) => async (action) => {
    if (action.type !== ListMobileActionsNames.RECEIVE_EVENT_GROUP) {
        next(action);
        return;
    }
    const { virtualCollection, sourceController, getState, collection, applyChanges } = ctx;
    const uiEvents = getUIEventsFromStomp(action.payload.event);

    for (const event of uiEvents) {
        switch (event.type) {
            case StompEventType.Begin: {
                virtualCollection.sync({
                    collection,
                    hasMoreStorage: getState().hasMoreStorage,
                });

                break;
            }
            case StompEventType.OnMark: {
                virtualCollection.mark(event.args);
                break;
            }
            case StompEventType.OnSelect: {
                virtualCollection.selectMany(event.args);
                break;
            }
            case StompEventType.OnReset: {
                virtualCollection.replaceAll(event.args);
                break;
            }
            case StompEventType.OnRemove: {
                virtualCollection.removeMany(event.args);
                break;
            }
            case StompEventType.OnReplace: {
                virtualCollection.replaceMany(event.args);
                break;
            }
            case StompEventType.OnAdd: {
                virtualCollection.addMany(event.args);
                break;
            }
            case StompEventType.OnPath: {
                virtualCollection.replacePath(event.args);
                sourceController.updateOptions({ root: virtualCollection.getRoot() });
                break;
            }
            case StompEventType.OnAddStub: {
                virtualCollection.addStub(event.args);
                break;
            }
            case StompEventType.OnRemoveStub: {
                virtualCollection.removeStub();
                break;
            }
            case StompEventType.End: {
                virtualCollection.end(event.args);
                applyChanges(virtualCollection.getChanges());
                virtualCollection.resetChanges();
                break;
            }
        }
    }

    next(action);
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        args,
        observerId,
        requestId,
    };
};
