import * as React from 'react';
import { TileCollection } from 'Controls/tile';
import { TemplateFunction } from 'UI/Base';
import {
    IItemPaddingOptions,
    IItemsContainerPaddingOptions,
    IViewTriggerProps,
    TTriggerVisibilityChangedCallback,
    TBackgroundStyle,
} from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';
import { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';
import { ITileEventHandlers } from 'Controls/_tileRender/item/utils/Props/EventHandlers';

export interface ICompatibleTileProps {
    itemTemplate?: TemplateFunction;
    groupTemplate?: TemplateFunction;
}

export interface IDirtyTileProps {
    needShowEmptyTemplate?: boolean;
    itemsContainerClass?: string;
}

export interface IControlsListsTileProps {
    onViewTriggerVisibilityChanged?: TTriggerVisibilityChangedCallback;
    viewTriggerProps?: IViewTriggerProps;
}

export interface ITileViewProps
    extends ICompatibleTileProps,
        IControlsListsTileProps,
        IDirtyTileProps,
        IItemPaddingOptions,
        IItemsContainerPaddingOptions,
        IItemActionsOptions,
        IItemActionsHandler {
    collection: TileCollection;
    collectionVersion: number;
    itemHandlers: ITileEventHandlers;
    orientation?: TTileOrientation;
    itemRender?: React.ReactElement;
    emptyRender?: React.ReactElement;
    onCustomdragStart?: Function;
    onCustomdragEnd?: Function;

    imageProperty?: string;
    displayProperty?: string;

    stickyFooter?: boolean;
    backgroundStyle?: TBackgroundStyle;
    style?: 'master' | 'default';
    footerTemplateOptions?: object;
}

export type TPosition = 'backward' | 'forward';
export type TTileOrientation = 'horizontal' | 'vertical';
