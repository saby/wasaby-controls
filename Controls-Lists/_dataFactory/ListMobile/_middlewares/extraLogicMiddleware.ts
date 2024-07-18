import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';

export const extraLogicMiddleware: IListMobileMiddleware = (context) => {
    const { applyChanges, collection, virtualCollection } = context;

    return (next) => (action) => {
        switch (action.type) {
            case IListMobileActionType.CHANGE_UI_COLLECTION_ROOT: {
                virtualCollection.sync({
                    collection,
                    hasMoreStorage: context.state.hasMoreStorage,
                });
                virtualCollection.changeRoot(action.payload.key);
                applyChanges(virtualCollection.getChanges());
                break;
            }
        }

        next(action);
    };
};
