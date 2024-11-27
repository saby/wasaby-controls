/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TKey } from 'Controls-DataEnv/interface';
import type { MarkerDirection } from 'Controls/interface';
import type { CrudEntityKey } from 'Types/source';
import { ListMobileActionsNames } from '../actions';

/**
 * Middleware-функция, вызывающая удаленные процедуры.
 * Здесь объявлены действия, которые обрабатываются мобильным контроллером.
 */
export const rpcInvokeMiddleware: TListMobileMiddleware = ({
    sourceController,
    scrollController,
    virtualCollection,
    getState,
}) => {
    const extractIndex = ({ payload: { key } }: TActionsWithKey): number => {
        return virtualCollection.getIndexByKey(key as CrudEntityKey);
    };

    return (next) => async (action) => {
        switch (action.type) {
            case ListMobileActionsNames.MOVE: {
                await sourceController.move(action.payload.root);
                break;
            }
            case ListMobileActionsNames.PREV_DISPLAY: {
                await sourceController.prevDisplay(action.payload.root);
                break;
            }
            case ListMobileActionsNames.NEXT_DISPLAY: {
                await sourceController.nextDisplay(action.payload.root);
                break;
            }
            case 'setMarkedKey': {
                await sourceController.mark(extractIndex(action));
                break;
            }
            case 'select': {
                // FIXME: Убрать, это появилось из за разницы типов.
                //  А разница типов появилась потому что MarkerDirection
                //  это enum.
                const dir = (
                    action.payload.direction === 'backward'
                        ? 'Backward'
                        : action.payload.direction === 'forward'
                        ? 'Forward'
                        : undefined
                ) as MarkerDirection | undefined;

                return sourceController.select(extractIndex(action), dir);
            }
            case 'selectAll': {
                await sourceController.selectAll();
                break;
            }
            case 'invertSelection': {
                await sourceController.invertSelection();
                break;
            }
            case 'resetSelection': {
                // TODO: openOperationsPanel -> resetSelection
                await sourceController.resetSelection();
                break;
            }
            case 'expand': {
                await sourceController.expand(extractIndex(action));
                break;
            }
            case 'collapse': {
                await sourceController.collapse(extractIndex(action));
                break;
            }
            case 'setFilter': {
                await sourceController.setFilter(action.payload.filter as Record<string, unknown>);
                break;
            }

            case 'next': {
                const { hasMoreStorage, root } = getState();
                if (hasMoreStorage?.[`${root}`]?.forward !== true) {
                    return;
                }
                return sourceController.next(
                    extractIndex({
                        payload: {
                            key: scrollController.getForwardKey(),
                        },
                    })
                );
            }
            case 'prev': {
                const { hasMoreStorage, root } = getState();
                if (hasMoreStorage?.[`${root}`]?.backward !== true) {
                    return;
                }
                return sourceController.prev(
                    extractIndex({
                        payload: {
                            key: scrollController.getBackwardKey(),
                        },
                    })
                );
            }
        }

        next(action);
    };
};

type TActionsWithKey =
    | TAbstractListActions.marker.TSetMarkedKeyAction
    | TAbstractListActions.selection.TSelectAction
    | TAbstractListActions.expandCollapse.TExpandAction
    | TAbstractListActions.expandCollapse.TCollapseAction
    | {
          payload: {
              key: TKey;
          };
      };
