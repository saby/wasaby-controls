/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import { TListMobileActions } from '../actions';

/**
 * Middleware-функция, обрабатывающая действий, не отслеживаемых мобильным контроллером.
 * Рудимент от аспектов, будет разложена по другим middleware-функциям.
 */
export const extraLogicMiddleware: TListMobileMiddleware = (context) => {
    const { applyChanges, collection, virtualCollection, getState } = context;

    const isExtraAction = (action: TListMobileActions.TAnyListMobileAction): boolean => {
        const extraActions: (typeof action.type)[] = [
            'openOperationsPanel',
            'closeOperationsPanel',
        ];
        return !!extraActions.find((type) => type === action.type);
    };

    const sync = () => {
        virtualCollection.sync({
            collection: collection,
            hasMoreStorage: getState().hasMoreStorage,
        });
    };

    const apply = () => {
        applyChanges(virtualCollection.getChanges());
    };

    return (next) => async (action) => {
        if (!isExtraAction(action)) {
            next(action);
            return;
        }

        sync();

        switch (action.type) {
            case 'openOperationsPanel': {
                virtualCollection.openOperationsPanel();
                break;
            }
            case 'closeOperationsPanel': {
                virtualCollection.closeOperationsPanel();
                break;
            }
        }

        apply();

        next(action);
    };
};
