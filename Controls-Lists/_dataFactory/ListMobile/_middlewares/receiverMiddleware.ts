import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import { IStompEventType } from '../_interface/IExternalTypes';

export const receiverMiddleware: IListMobileMiddleware = (context) => {
    const { applyChanges, collection, virtualCollection } = context;

    return (next) => (action) => {
        if (action.type !== IListMobileActionType.RECEIVE_EVENT_GROUP) {
            next(action);
            return;
        }

        virtualCollection.sync({ collection, hasMoreStorage: context.state.hasMoreStorage });

        for (const event of action.payload.events) {
            switch (event.type) {
                case IStompEventType.OnMark: {
                    virtualCollection.mark(event.args);
                    break;
                }
                case IStompEventType.OnSelect: {
                    virtualCollection.selectMany(event.args);
                    break;
                }
                case IStompEventType.OnReset: {
                    virtualCollection.replaceAll(event.args);
                    break;
                }
                case IStompEventType.OnRemove: {
                    virtualCollection.removeMany(event.args);
                    break;
                }
                case IStompEventType.OnReplace: {
                    virtualCollection.replaceMany(event.args);
                    break;
                }
                case IStompEventType.OnAdd: {
                    virtualCollection.addMany(event.args);
                    break;
                }
                case IStompEventType.OnPath: {
                    virtualCollection.replacePath(event.args);
                    break;
                }
                case IStompEventType.End: {
                    virtualCollection.end(event.args);
                    break;
                }
            }
        }

        applyChanges(virtualCollection.getChanges());

        next(action);
    };
};
