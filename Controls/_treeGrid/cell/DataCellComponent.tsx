import * as React from 'react';
import { CellComponent, ICellComponentProps } from 'Controls/grid';
import ContentRenderWithExpander from 'Controls/_treeGrid/cell/contentRenders/ContentRenderWithExpander';

const TreeGridCellComponentForwardRef = React.forwardRef(
    (props: ICellComponentProps, ref: React.ForwardedRef<HTMLElement>) => {
        if (props.shouldDisplayExpander) {
            const contentRenderWithExpander = <ContentRenderWithExpander {...props} />;

            return <CellComponent {...props} contentRender={contentRenderWithExpander} ref={ref} />;
        }

        return <CellComponent {...props} ref={ref} />;
    }
);

TreeGridCellComponentForwardRef.displayName = 'TreeGridCellComponentForwardRef';

export const TreeGridCellComponent = React.memo(TreeGridCellComponentForwardRef);

TreeGridCellComponent.displayName = 'TreeGridCellComponentMemo';
