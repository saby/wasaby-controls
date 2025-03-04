/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { helpers, UILogic } from 'Controls/listsCommonLogic';
import { constants } from 'Env/Env';
import { ItemActionsContext } from 'Controls/itemActions';
import type { TreeItem as ITreeItem } from 'Controls/baseTreeDisplay';
import type { IAbstractRenderEventHandlers } from '../interface/IAbstractRenderEventHandlers';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { TWithInteractorProvidedProps } from '../HoC/withInteractor';
import type { TWithInteractorCommandsProvidedProps } from '../HoC/withInteractorCommands';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';

import { useDndContext } from '../RenderFeatures/DND/Container';

const {
    Common: { getKey },
} = UILogic;

/**
 * Хук, получающий обработчики событий render'а.
 */
export function useRenderEventHandlers<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
>({
    viewModelState,
    viewModelAPI,
    viewCommandHandlers: {
        onCheckboxClick,
        onItemClick,
        onExpanderClick,
        onHasMoreClick,
        onItemKeyDownArrowUp,
        onItemKeyDownArrowDown,
        onItemKeyDownArrowLeft,
        onItemKeyDownArrowRight,
        onItemKeyDownSpace,
        onItemKeyDownEnter,
        onItemKeyDownBackSpace,
    },
}: TWithInteractorProvidedProps<TListAPI, TListState> &
    TWithInteractorCommandsProvidedProps<TViewCommandHandlers>): TRenderEventHandlers {
    const dnd = useDndContext();
    const itemActionsCtx = React.useContext(ItemActionsContext);

    const handlers: IAbstractRenderEventHandlers = {
        itemHandlers: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onClick: (event, item: Model | Model[]) => {
                helpers.events.parseTreeGridViewItemClick<Model | Model[]>(
                    {
                        event,
                        item,
                        cleanScheme: true,
                    },
                    {
                        onCheckbox: () => {
                            onCheckboxClick(event, item);
                        },
                        onItem: (e) => {
                            onItemClick(e, item);
                        },
                        onExpander: () => {
                            onExpanderClick(event, item);
                        },
                        onHasMore: () => {
                            onHasMoreClick(event, item);
                        },
                        nodeHasMore: (_event, _item, direction) => {
                            if (!viewModelState.collection) {
                                return;
                            }

                            // FIXME: Получение ключа узла, для которого отображается кнопка еще,
                            // должно происходить в рендере.
                            const nodeExtraRowKey = getKey(item);
                            const parentNode = (
                                viewModelState.collection
                                    .getItems()
                                    .find((i) => i.key === nodeExtraRowKey) as unknown as ITreeItem
                            )?.getParent();

                            if (!parentNode) {
                                return;
                            }

                            const nodeKey = parentNode.key;

                            if (direction === 'up') {
                                viewModelAPI.prev(nodeKey);
                            } else {
                                viewModelAPI.next(nodeKey);
                            }
                        },
                    }
                );
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onMouseDown: (event: React.MouseEvent, item: Model | Model[]) => {
                helpers.events.parseTreeGridViewItemClick<Model | Model[]>(
                    {
                        event,
                        item,
                        cleanScheme: true,
                    },
                    {
                        onItem: () => {
                            dnd?.tryStart(event.nativeEvent, getKey(item));
                        },
                    }
                );
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onMouseMove: (event: React.MouseEvent, item: Model | Model[]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                itemActionsCtx?.onMouseMove?.(event, item);
                dnd?.move(event.nativeEvent, getKey(item));
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onContextMenu: (event: React.MouseEvent, item: Model | Model[]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                itemActionsCtx?.onContextMenu?.(event, item);
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onSwipeCallback: (event: React.MouseEvent, item: Model | Model[]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                itemActionsCtx?.onSwipe?.(event, item);
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, item: Model | Model[]) => {
                const keyHandlers = {
                    [constants.key.up]: () => {
                        onItemKeyDownArrowUp(event, item);
                    },
                    [constants.key.down]: () => {
                        onItemKeyDownArrowDown(event, item);
                    },
                    [constants.key.left]: () => {
                        onItemKeyDownArrowLeft(event, item);
                    },
                    [constants.key.right]: () => {
                        onItemKeyDownArrowRight(event, item);
                    },
                    [constants.key.space]: () => {
                        onItemKeyDownSpace(event, item);
                    },
                    [constants.key.enter]: () => {
                        onItemKeyDownEnter(event, item);
                    },
                    [constants.key.backspace]: () => {
                        onItemKeyDownBackSpace(event);
                    },
                };
                helpers.events.parseViewKeyDown(event, keyHandlers);
            },
        },
    };
    return handlers as TRenderEventHandlers;
}

export default useRenderEventHandlers;
