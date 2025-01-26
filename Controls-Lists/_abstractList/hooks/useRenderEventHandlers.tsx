/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { helpers } from 'Controls/listsCommonLogic';
import { constants } from 'Env/Env';

import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import type { IAbstractRenderEventHandlers } from '../interface/IAbstractRenderEventHandlers';

export function useRenderEventHandlers<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
>(props: TViewCommandHandlers): TRenderEventHandlers {
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
                            props.onCheckboxClick(event, item);
                        },
                        onItem: (e) => {
                            props.onItemClick(e, item);
                        },
                        onExpander: () => {
                            props.onExpanderClick(event, item);
                        },
                        onHasMore: () => {
                            props.onHasMoreClick(event, item);
                        },
                    }
                );
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, item: Model | Model[]) => {
                const keyHandlers = {
                    [constants.key.up]: () => {
                        props.onItemKeyDownArrowUp(event, item);
                    },
                    [constants.key.down]: () => {
                        props.onItemKeyDownArrowDown(event, item);
                    },
                    [constants.key.left]: () => {
                        props.onItemKeyDownArrowLeft(event, item);
                    },
                    [constants.key.right]: () => {
                        props.onItemKeyDownArrowRight(event, item);
                    },
                    [constants.key.space]: () => {
                        props.onItemKeyDownSpace(event, item);
                    },
                    [constants.key.enter]: () => {
                        props.onItemKeyDownEnter(event, item);
                    },
                };
                helpers.events.parseViewKeyDown(event, keyHandlers);
            },
        },
    };
    return handlers as TRenderEventHandlers;
}
