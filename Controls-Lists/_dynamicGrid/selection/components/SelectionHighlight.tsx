import * as React from 'react';
import { RowSelectionContext } from 'Controls-Lists/_dynamicGrid/selection/selectionContext/rowSelectionContext/RowSelectionContext';
import { useHandler } from 'Controls/hooks';
import { MultiSelectAccessibility } from 'Controls/display';
import { TColumnKey } from 'Controls-Lists/_dynamicGrid/selection/shared/types';
import { TOffsetSize } from 'Controls/interface';
import { DragSelectionContext } from 'Controls-Lists/_dynamicGrid/selection/dragSelection/dragSelectionContext/DragSelectionContext';
import { TResizerDirection } from 'Controls-Lists/_dynamicGrid/selection/dragSelection/shared/types';

export interface IBorderRadius {
    topLeft?: TOffsetSize;
    topRight?: TOffsetSize;
    bottomRight?: TOffsetSize;
    bottomLeft?: TOffsetSize;
}

interface ISelectionHighlightProps {
    columnKey: TColumnKey;
    borderRadius: IBorderRadius;
}

interface ISelectionResizerRenderProps {
    itemsSpacing: TOffsetSize;
    columnsSpacing: TOffsetSize;
    onResizerMouseDown?: (mouseEvent: React.MouseEvent, direction: TResizerDirection) => void;
}

export function SelectionHighlight(props: ISelectionHighlightProps) {
    const { borderRadius, columnKey } = props;
    const highlightContainerStyle = {
        borderBottomLeftRadius: `${
            borderRadius.bottomLeft ? `var(--border-radius_${borderRadius.bottomLeft})` : 0
        }`,
        borderBottomRightRadius: `${
            borderRadius.bottomRight ? `var(--border-radius_${borderRadius.bottomRight})` : 0
        }`,
        borderTopRightRadius: `${
            borderRadius.topRight ? `var(--border-radius_${borderRadius.topRight})` : 0
        }`,
        borderTopLeftRadius: `${
            borderRadius.topLeft ? `var(--border-radius_${borderRadius.topLeft})` : 0
        }`,
    };
    const rightBottomBevelStyle = {
        borderBottomRightRadius: `${
            borderRadius.bottomRight ? `var(--border-radius_${borderRadius.bottomRight})` : 0
        }`,
    };
    const leftTopBevelStyle = {
        borderTopLeftRadius: `${
            borderRadius.topLeft ? `var(--border-radius_${borderRadius.topLeft})` : 0
        }`,
    };
    const rowCtx = React.useContext(RowSelectionContext);
    const dragSelectionCtx = React.useContext(DragSelectionContext);
    const isDragging = React.useMemo(() => {
        return dragSelectionCtx.isDragging;
    }, [dragSelectionCtx]);
    const onResizerMouseDown = useHandler(
        React.useCallback<ISelectionResizerRenderProps['onResizerMouseDown']>(
            (e) => {
                const actualDragCtx = dragSelectionCtx.contextRefForHandlersOnly.current;
                const actualRowCtx = rowCtx.contextRefForHandlersOnly.current;
                actualDragCtx.startDrag(e, actualRowCtx.getBoundingSelectionKeys(columnKey));
            },
            [columnKey]
        )
    );
    const isSelected = React.useMemo(() => {
        return rowCtx.isSelected(columnKey);
    }, [columnKey, rowCtx]);
    if (
        rowCtx.isEnabled &&
        rowCtx.isSelectionInitialized &&
        rowCtx.getMultiSelectAccessibility(columnKey) !== MultiSelectAccessibility.hidden
    ) {
        return (
            <div
                className={`${
                    !isDragging ? 'ControlsLists-dynamicGrid__selection__highlight' : ''
                } ${
                    isSelected
                        ? 'ControlsLists-dynamicGrid__cell-selected'
                        : 'ControlsLists-dynamicGrid__cell-unselected'
                }`}
                style={highlightContainerStyle}
            >
                <div
                    className={`${
                        !isDragging
                            ? 'ControlsLists-dynamicGrid__selection__highlight_right-bottom_bevel'
                            : ''
                    }`}
                    style={rightBottomBevelStyle}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onResizerMouseDown(e);
                    }}
                ></div>
                <div
                    className={`${
                        !isDragging
                            ? 'ControlsLists-dynamicGrid__selection__highlight_left-top_bevel'
                            : ''
                    }`}
                    style={leftTopBevelStyle}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onResizerMouseDown(e);
                    }}
                ></div>
            </div>
        );
    } else {
        return null;
    }
}

export const SelectionHighlightMemo = React.memo((props: ISelectionHighlightProps) => {
    const rowCtx = React.useContext(RowSelectionContext);
    if (!rowCtx) {
        return null;
    }
    return <SelectionHighlight {...props} />;
});
