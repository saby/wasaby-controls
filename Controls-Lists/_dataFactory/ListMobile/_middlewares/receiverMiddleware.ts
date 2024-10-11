import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import { StompEventType } from '../_interface/IExternalTypes';

export const receiverMiddleware: IListMobileMiddleware = (context) => {
    const { applyChanges, collection, virtualCollection, sourceController } = context;

    return (next) => (action) => {
        if (action.type !== IListMobileActionType.RECEIVE_EVENT) {
            next(action);
            return;
        }

        const event = action.payload.event;
        switch (event.type) {
            case StompEventType.Begin: {
                virtualCollection.sync({
                    collection,
                    hasMoreStorage: context.state.hasMoreStorage,
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
                virtualCollection.removeStub(/*event.args*/);
                break;
            }
            case StompEventType.End: {
                virtualCollection.end(event.args);
                applyChanges(virtualCollection.getChanges());
                virtualCollection.resetChanges();
                break;
            }
        }

        next(action);
    };
};
