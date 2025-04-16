import * as React from 'react';
import {
    IBaseRenderAspects,
    IItemRenderProps,
} from 'Controls/_tileRender/interface/IRenderAspects';

export interface ITileRenderWrapperProps extends IBaseRenderAspects, IItemRenderProps {
    render: React.ReactElement;
    isReactTile: boolean;
    scale?: boolean;
}

export function TileRenderWrapper({ render, scale, ...renderProps }: ITileRenderWrapperProps) {
    return React.cloneElement(render, renderProps);
}
