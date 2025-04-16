import { IBaseRenderAspects, ICaptionProps } from 'Controls/_tileRender/interface/IRenderAspects';
import { ITooltipProps } from 'Controls/interface';
import { CSSProperties } from 'react';

export interface IDefaultTileRenderProps extends IBaseRenderAspects, ICaptionProps, ITooltipProps {
    style?: CSSProperties;
}
