/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { CellComponent, ICellComponentProps } from 'Controls/gridRender';
import ExpanderWrapper from 'Controls/_treeGridRender/cell/content/ExpanderWrapper';

/**
 * Приватный компонент ячейки в дереве с колонками.
 * При необходимости добавляет кнопку разворота узла или отступ - ExpanderWrapper
 * @private
 */
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
