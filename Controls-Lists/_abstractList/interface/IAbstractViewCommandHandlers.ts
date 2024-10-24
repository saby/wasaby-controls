/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { Model } from 'Types/entity';
import type { IAction } from 'Controls/interface';
import type { BaseAction } from 'Controls/actions';

type TViewKeyDownEventHandler = (event: React.KeyboardEvent<HTMLDivElement>) => void;

type TItemKeyDownEventHandler = (
    event: React.KeyboardEvent<HTMLDivElement>,
    item: Model | Model[]
) => void;

export interface IAbstractViewCommandHandlers {
    onCheckboxClick: (event: React.MouseEvent, item: Model | Model[]) => void;
    onItemClick: (event: React.MouseEvent, item: Model | Model[]) => void;
    onExpanderClick: (
        event: React.MouseEvent,
        item: Model | Model[],
        params?: {
            markItem?: boolean;
        }
    ) => void;

    onHasMoreClick: (event: React.MouseEvent, item: Model | Model[]) => void;

    onItemKeyDownArrowUp: TItemKeyDownEventHandler;
    onItemKeyDownArrowDown: TItemKeyDownEventHandler;
    onItemKeyDownArrowLeft: TItemKeyDownEventHandler;
    onItemKeyDownArrowRight: TItemKeyDownEventHandler;
    onItemKeyDownSpace: TItemKeyDownEventHandler;
    onItemKeyDownEnter: TItemKeyDownEventHandler;

    onViewKeyDownArrowUp: TViewKeyDownEventHandler;
    onViewKeyDownArrowDown: TViewKeyDownEventHandler;
    onViewKeyDownArrowLeft: TViewKeyDownEventHandler;
    onViewKeyDownArrowRight: TViewKeyDownEventHandler;
    onViewKeyDownSpace: TViewKeyDownEventHandler;
    onViewKeyDownDel: TViewKeyDownEventHandler;
    onViewKeyDownEnter: TViewKeyDownEventHandler;

    onActionClick(
        action: IAction | BaseAction,
        item: Model,
        container: HTMLDivElement,
        nativeEvent: React.MouseEvent
    ): void;
}
