import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import { IStompEventType } from '../_interface/IExternalTypes';
import { VirtualCollection } from '../_VirtualCollection';

export const receiverMiddleware: IListMobileMiddleware = ({ applyChanges, collection }) => {
    const virtualCollection = new VirtualCollection();

    return (next) => (action) => {
        if (action.type !== IListMobileActionType.RECEIVE_EVENT_GROUP) {
            next(action);
            return;
        }

        virtualCollection.sync(collection);

        for (const event of action.payload.events) {
            switch (event.type) {
                case IStompEventType.OnMark: {
                    virtualCollection.mark(event.args[0].disable, event.args[0].enable);
                    break;
                }
                case IStompEventType.OnSelect: {
                    virtualCollection.selectMany(event.args[0]);
                    break;
                }
                case IStompEventType.OnReset: {
                    virtualCollection.replaceAll(event.args[0]);
                    break;
                }
                case IStompEventType.OnRemove: {
                    virtualCollection.removeMany(event.args[0]);
                    break;
                }
                case IStompEventType.OnReplace: {
                    virtualCollection.replaceMany(event.args[0]);
                    break;
                }
                case IStompEventType.OnAdd: {
                    virtualCollection.addMany(event.args[0]);
                    break;
                }
                case IStompEventType.OnPath: {
                    virtualCollection.replacePath(event.args[0]);
                    break;
                }
            }
        }

        applyChanges(virtualCollection.getChanges());

        next(action);
    };
};
