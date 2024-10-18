import * as React from 'react';
import { CellComponent, ICellComponentProps } from 'Controls/grid';
import { CellRenderWithExpander } from 'Controls/baseTreeGrid';

const TreeGridCellComponentForwardRef = React.forwardRef(
    (props: ICellComponentProps, ref: React.ForwardedRef<HTMLElement>) => {
        if (props.shouldDisplayExpander) {
            const renderWithExpander = <CellRenderWithExpander {...props} />;

            return <CellComponent {...props} render={renderWithExpander} ref={ref} />;
        }

        return <CellComponent {...props} ref={ref} />;
    }
);

TreeGridCellComponentForwardRef.displayName = 'TreeGridCellComponentForwardRef';

export const TreeGridCellComponent = React.memo(TreeGridCellComponentForwardRef);

TreeGridCellComponent.displayName = 'TreeGridCellComponentMemo';
