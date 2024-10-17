import * as React from 'react';
import { CollectionItem } from 'Controls/display';
import { IAction } from 'Controls/interface';
import {
    IItemActionsTemplateMountedCallback,
    IItemActionsTemplateUnmountedCallback,
} from 'Controls/itemActions';

export interface IItemActionsHandler {
    onActionsMouseEnter?: (event: React.MouseEvent<HTMLDivElement>, item: CollectionItem) => void;
    onActionMouseEnter?: (
        event: React.MouseEvent<HTMLDivElement>,
        action: IAction,
        item: CollectionItem
    ) => void;
    onActionMouseLeave?: (
        event: React.MouseEvent<HTMLDivElement>,
        action: IAction,
        item: CollectionItem
    ) => void;
    onActionMouseDown?: (
        event: React.MouseEvent<HTMLDivElement>,
        action: IAction,
        item: CollectionItem
    ) => void;
    onActionMouseUp?: (
        event: React.MouseEvent<HTMLDivElement>,
        action: IAction,
        item: CollectionItem
    ) => void;
    onActionClick?: (
        event: React.MouseEvent<HTMLDivElement>,
        action: IAction,
        item: CollectionItem
    ) => void;
    onItemActionSwipeAnimationEnd?: (event: React.AnimationEvent) => void;
    itemActionsTemplateMountedCallback?: IItemActionsTemplateMountedCallback;
    itemActionsTemplateUnmountedCallback?: IItemActionsTemplateUnmountedCallback;
}
