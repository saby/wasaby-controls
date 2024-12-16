/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TKey } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import { ListMobileActionsNames } from '../actions';

/**
 * Middleware-функция, вызывающая удаленные процедуры.
 * Здесь объявлены действия, которые обрабатываются мобильным контроллером.
 */
export const rpcInvokeMiddleware: TListMobileMiddleware = ({
    sourceController: RpcFacade,
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
                await RpcFacade.move(action.payload.root);
                break;
            }
            case ListMobileActionsNames.PREV_DISPLAY: {
                await RpcFacade.prevDisplay(action.payload.root);
                break;
            }
            case ListMobileActionsNames.NEXT_DISPLAY: {
                await RpcFacade.nextDisplay(action.payload.root);
                break;
            }
            case 'mark': {
                await RpcFacade.mark(extractIndex(action));
                break;
            }
            case 'select': {
                return RpcFacade.select(extractIndex(action), action.payload.direction);
            }
            case 'selectAll': {
                await RpcFacade.selectAll();
                break;
            }
            case 'invertSelection': {
                await RpcFacade.invertSelection();
                break;
            }
            case 'resetSelection': {
                // TODO: openOperationsPanel -> resetSelection
                await RpcFacade.resetSelection();
                break;
            }
            case 'expand': {
                await RpcFacade.expand(extractIndex(action));
                break;
            }
            case 'collapse': {
                await RpcFacade.collapse(extractIndex(action));
                break;
            }
            case 'setFilter': {
                await RpcFacade.setFilter(action.payload.filter as Record<string, unknown>);
                break;
            }

            case 'next': {
                const { hasMoreStorage, root } = getState();
                if (hasMoreStorage?.[`${root}`]?.forward !== true) {
                    return;
                }
                return RpcFacade.next(
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
                return RpcFacade.prev(
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
    | TAbstractListActions.marker.TMarkAction
    | TAbstractListActions.selection.TSelectAction
    | TAbstractListActions.expandCollapse.TExpandAction
    | TAbstractListActions.expandCollapse.TCollapseAction
    | {
          payload: {
              key: TKey;
          };
      };
