import * as React from 'react';
import {
    IBorderProps,
    ICheckboxProps,
    IMarkerProps,
    IPaddingProps,
    IRoundAnglesProps,
    IShadowProps,
    TObjectFit,
} from 'Controls/interface';

import { ITileActionProps } from 'Controls/_tileRender/item/utils/Props/Actions';
import { ITileMarkerProps } from 'Controls/_tileRender/item/utils/Props/Marker';
import { ITileCheckboxProps } from 'Controls/_tileRender/item/utils/Props/Checkbox';
import { ITileImageProps } from 'Controls/_tileRender/item/utils/Props/Image';
import type { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';
import type { IItemEventHandlers } from 'Controls/_baseList/ItemComponent';
import { TInternalProps } from 'UICore/Executor';
import { ITileSearchProps } from 'Controls/_tileRender/item/utils/Props/Search';

export interface IImageProps {
    imageSrc?: string | string[];
    imageRender?: React.ReactElement;
    imageClassName?: string;
    fallbackImage?: string;
}

export interface IImageFitProps {
    imageFit?: TObjectFit;
}

export type TTileActionsPosition = 'custom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface IDataQaProps {
    dataQa?: string;
}

export interface ICaptionProps {
    caption?: string | React.ReactElement;
}

/**
 * Базовый набор параметров рендер плитки
 * @public
 */
export interface IBaseRenderAspects
    extends IImageProps,
        IImageFitProps,
        IMarkerProps,
        ICheckboxProps,
        IShadowProps,
        IBorderProps,
        IRoundAnglesProps,
        ITileActionProps,
        IDataQaProps {}

export interface IItemRenderProps
    extends ITileMarkerProps,
        ITileCheckboxProps,
        ITileActionProps,
        IRoundAnglesProps,
        IPaddingProps,
        ICaptionProps,
        ITileImageProps,
        IItemActionsHandler,
        IItemEventHandlers,
        TInternalProps,
        ITileSearchProps {}

/* todo list:
    1. border -> borderVisibility
    2. nodeContentTemplate ?
    3. width в compatible-слое
    4. hasTitle - просто наличие title
    5. staticHeight в compatible-слое
    6. height в compatible-слое
    7. imageClass->imageClassName

*/
