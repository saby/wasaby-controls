import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import { useHandler } from 'Controls/Hooks/useHandler';
import { DragSelectionContext } from '../dragSelectionContext/DragSelectionContext';
import { RowSelectionContext } from '../../selectionContext/rowSelectionContext/RowSelectionContext';
import {
    TResizerVerticalDirection,
    TResizerHorizontalDirection,
    TResizerDirection,
    TResizerDiagonalDirection,
} from '../shared/types';
import { TColumnKey } from '../../shared/types';

interface ISelectionResizerRenderProps {
    resizerVisibility: Partial<Record<TResizerDirection, boolean>>;
    itemsSpacing: TOffsetSize;
    columnsSpacing: TOffsetSize;
    onResizerMouseDown?: (mouseEvent: React.MouseEvent, direction: TResizerDirection) => void;
}

const BASE_CLASS_NAME = 'ControlsLists-dynamicGrid__selection__resizer';

interface IResizerVisibilityState {
    values: TResizerDirection[];
    classNameMap: Partial<Record<TResizerDirection, string>>;
}

const SelectionResizerRender = React.memo(function SelectionResizerRender(
    props: ISelectionResizerRenderProps
): JSX.Element {
    const resizerVisibility = React.useMemo(() => {
        const res: IResizerVisibilityState = {
            values: [],
            classNameMap: {},
        };

        const getColspanSize = (
            direction: TResizerVerticalDirection | TResizerHorizontalDirection
        ): TOffsetSize => {
            return direction === 'left' || direction === 'right'
                ? props.itemsSpacing
                : props.columnsSpacing;
        };

        const lineVariants: [
            resizerDirection: TResizerVerticalDirection | TResizerHorizontalDirection,
            resizerAnglesDirections: [
                backward: TResizerDiagonalDirection,
                forward: TResizerDiagonalDirection
            ],
            resizerSiblingsDirections: [
                backward: TResizerVerticalDirection | TResizerHorizontalDirection,
                forward: TResizerVerticalDirection | TResizerHorizontalDirection
            ]
        ][] = [
            ['top', ['topLeft', 'topRight'], ['left', 'right']],
            ['bottom', ['bottomLeft', 'bottomRight'], ['left', 'right']],
            ['left', ['topLeft', 'bottomLeft'], ['top', 'bottom']],
            ['right', ['topRight', 'bottomRight'], ['top', 'bottom']],
        ];

        lineVariants.forEach(([direction, edges, perpendicular]) => {
            if (props.resizerVisibility[direction]) {
                res.values.push(direction);
                let beforeSpacing;
                let afterSpacing;

                if (props.resizerVisibility[edges[0]]) {
                    beforeSpacing = 'spacing';
                } else if (props.resizerVisibility[perpendicular[0]]) {
                    beforeSpacing = 'noSpacing';
                } else {
                    beforeSpacing = `colspan-${getColspanSize(direction)}`;
                }

                if (props.resizerVisibility[edges[1]]) {
                    afterSpacing = 'spacing';
                } else if (props.resizerVisibility[perpendicular[1]]) {
                    afterSpacing = 'noSpacing';
                } else {
                    afterSpacing = `colspan-${getColspanSize(direction)}`;
                }

                res.classNameMap[
                    direction
                ] = `${BASE_CLASS_NAME} ${BASE_CLASS_NAME}_${direction} ${BASE_CLASS_NAME}_${direction}_${beforeSpacing}_${afterSpacing}`;
            }
        });

        const rectVariants: TResizerDirection[] = [
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight',
        ];

        rectVariants.forEach((direction) => {
            if (props.resizerVisibility[direction]) {
                res.values.push(direction);
                res.classNameMap[direction] = `${BASE_CLASS_NAME} ${BASE_CLASS_NAME}_${direction}`;
            }
        });

        return res;
    }, [props.resizerVisibility]);

    return (
        <>
            {resizerVisibility.values.map((key) => {
                return (
                    <div
                        className={resizerVisibility.classNameMap[key]}
                        key={key}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onResizerMouseDown(e, key);
                        }}
                    />
                );
            })}
        </>
    );
});

export interface ISelectionResizerProps {
    columnKey: TColumnKey;
}

export const SelectionResizer = function SelectionResizer(
    props: ISelectionResizerProps
): JSX.Element {
    const rowCtx = React.useContext(RowSelectionContext);
    const dragSelectionCtx = React.useContext(DragSelectionContext);

    const onResizerMouseDown = useHandler(
        React.useCallback<ISelectionResizerRenderProps['onResizerMouseDown']>(
            (e, direction) => {
                const actualDragCtx = dragSelectionCtx.contextRefForHandlersOnly.current;
                const actualRowCtx = rowCtx.contextRefForHandlersOnly.current;
                actualDragCtx.startDrag(
                    e,
                    actualRowCtx.getBoundingSelectionKeys(props.columnKey),
                    direction
                );
            },
            [props.columnKey]
        )
    );

    if (rowCtx.isEnabled && rowCtx.isSelected(props.columnKey)) {
        const selection = rowCtx.getCellsSelectionModel(props.columnKey);
        return (
            <SelectionResizerRender
                onResizerMouseDown={onResizerMouseDown}
                itemsSpacing={rowCtx.itemsSpacing}
                columnsSpacing={rowCtx.columnsSpacing}
                resizerVisibility={{
                    top: !selection.hasSiblingUp,
                    bottom: !selection.hasSiblingDown,
                    left: selection.firstColumnKey === props.columnKey,
                    right: selection.lastColumnKey === props.columnKey,
                    topLeft:
                        !selection.hasSiblingUp && selection.firstColumnKey === props.columnKey,
                    topRight:
                        !selection.hasSiblingUp && selection.lastColumnKey === props.columnKey,
                    bottomLeft:
                        !selection.hasSiblingDown && selection.firstColumnKey === props.columnKey,
                    bottomRight:
                        !selection.hasSiblingDown && selection.lastColumnKey === props.columnKey,
                }}
            />
        );
    }

    return null;
};

const SelectionResizerMemo = React.memo((props: ISelectionResizerProps) => {
    const rowCtx = React.useContext(RowSelectionContext);
    if (!rowCtx) {
        return null;
    }
    return <SelectionResizer {...props} />;
});
export default SelectionResizerMemo;
