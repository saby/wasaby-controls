import * as React from 'react';
import { CellComponent, ICellComponentProps } from 'Controls/gridRender';
import ExpanderWrapper from 'Controls/_treeGridRender/cell/content/ExpanderWrapper';

const TreeGridCellComponentForwardRef = React.forwardRef(
    (props: ICellComponentProps, ref: React.ForwardedRef<HTMLElement>) => {
        if (props.shouldDisplayExpander) {
            const contentRenderWithExpander = <ExpanderWrapper {...props} />;

            return <CellComponent {...props} contentRender={contentRenderWithExpander} ref={ref} />;
        }

        return <CellComponent {...props} ref={ref} />;
    }
);

export const TreeGridCellComponent = TreeGridCellComponentForwardRef;
