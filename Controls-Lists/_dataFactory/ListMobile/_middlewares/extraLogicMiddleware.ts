/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListMobileAction, IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';

export const extraLogicMiddleware: IListMobileMiddleware = (context) => {
    const { applyChanges, collection, virtualCollection } = context;

    const isExtraAction = (action: IListMobileAction): boolean => {
        const extraActions = [
            IListMobileActionType.CHANGE_UI_COLLECTION_ROOT,
            IListMobileActionType.OPEN_OPERATIONS_PANEL,
            IListMobileActionType.CLOSE_OPERATIONS_PANEL,
        ];
        return !!extraActions.find((type) => type === action.type);
    };

    const sync = () => {
        virtualCollection.sync({
            collection,
            hasMoreStorage: context.state.hasMoreStorage,
        });
    };

    const apply = () => {
        applyChanges(virtualCollection.getChanges());
    };

    return (next) => (action) => {
        if (!isExtraAction(action)) {
            next(action);
            return;
        }

        sync();

        switch (action.type) {
            case IListMobileActionType.CHANGE_UI_COLLECTION_ROOT: {
                virtualCollection.changeRoot(action.payload.key);
                break;
            }
            case IListMobileActionType.OPEN_OPERATIONS_PANEL: {
                virtualCollection.openOperationsPanel();
                break;
            }
            case IListMobileActionType.CLOSE_OPERATIONS_PANEL: {
                virtualCollection.closeOperationsPanel();
                break;
            }
        }

        apply();

        next(action);
    };
};
