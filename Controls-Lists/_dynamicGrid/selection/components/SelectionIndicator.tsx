/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import { TItemKey } from '../shared/types';
import { RowSelectionContext } from '../selectionContext/rowSelectionContext/RowSelectionContext';
import { IRowSelectionModel, ICellsSelectionModel } from '../SelectionModel';
import { IBorderRadius } from 'Controls-Lists/_dynamicGrid/selection/components/SelectionHighlight';

interface ISelectionIndicatorRenderProps {
    itemsSpacing: TOffsetSize;
    selection: IRowSelectionModel;
    itemKey: TItemKey;
    borderRadius: IBorderRadius;
}

const SelectionIndicatorRender = React.memo(function SelectionIndicatorRender(
    props: ISelectionIndicatorRenderProps
): JSX.Element {
    const { borderRadius } = props;
    return (
        <>
            {Object.keys(props.selection)
                .filter(
                    (key) =>
                        typeof props.selection[key].gridColumnStart !== 'undefined' &&
                        typeof props.selection[key].gridColumnEnd !== 'undefined' &&
                        !props.selection[key].isHidden
                )
                .map((key) => {
                    const selection: ICellsSelectionModel = props.selection[key];
                    let className = 'ControlsLists-dynamicGrid__selection__indicator';

                    if (selection.hasSiblingUp) {
                        className += ' ControlsLists-dynamicGrid__selection__indicator_colspanTop';

                        if (props.itemsSpacing) {
                            className += ` ControlsLists-dynamicGrid__selection__indicator_colspanTop_${props.itemsSpacing}`;
                        }
                    }

                    if (selection.hasSiblingDown) {
                        className +=
                            ' ControlsLists-dynamicGrid__selection__indicator_colspanBottom';
                    }

                    const indicatorStyle = {
                        borderBottomLeftRadius: `${
                            borderRadius.bottomLeft && !selection.hasSiblingDown
                                ? `var(--border-radius_${borderRadius.bottomLeft})`
                                : 0
                        }`,
                        borderBottomRightRadius: `${
                            borderRadius.bottomRight && !selection.hasSiblingDown
                                ? `var(--border-radius_${borderRadius.bottomRight})`
                                : 0
                        }`,
                        borderTopRightRadius: `${
                            borderRadius.topRight && !selection.hasSiblingUp
                                ? `var(--border-radius_${borderRadius.topRight})`
                                : 0
                        }`,
                        borderTopLeftRadius: `${
                            borderRadius.topLeft && !selection.hasSiblingUp
                                ? `var(--border-radius_${borderRadius.topLeft})`
                                : 0
                        }`,
                    };

                    return (
                        <div
                            key={`${selection.firstColumnKey}_${selection.lastColumnKey}`}
                            className={className}
                            style={{
                                gridColumnStart: selection.gridColumnStart,
                                gridColumnEnd: selection.gridColumnEnd,
                                ...indicatorStyle,
                            }}
                        />
                    );
                })}
        </>
    );
});

export const SelectionIndicator = function SelectionIndicator() {
    const rowCtx = React.useContext(RowSelectionContext);

    if (rowCtx.isEnabled) {
        const selection = rowCtx.getRowSelectionModel();
        if (selection) {
            return (
                <SelectionIndicatorRender
                    itemKey={rowCtx.itemKey}
                    itemsSpacing={rowCtx.itemsSpacing}
                    selection={selection}
                    borderRadius={rowCtx.borderRadius}
                />
            );
        }
    }

    return null;
};

const SelectionIndicatorMemo = React.memo(() => {
    const rowCtx = React.useContext(RowSelectionContext);
    if (!rowCtx) {
        return null;
    }
    return <SelectionIndicator />;
});
export default SelectionIndicatorMemo;
