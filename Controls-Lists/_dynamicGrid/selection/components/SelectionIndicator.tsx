import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import { TItemKey } from '../shared/types';
import { RowSelectionContext } from '../selectionContext/rowSelectionContext/RowSelectionContext';
import { IRowSelectionModel, ICellsSelectionModel } from '../SelectionModel';

interface ISelectionIndicatorRenderProps {
    itemsSpacing: TOffsetSize;
    selection: IRowSelectionModel;
    itemKey: TItemKey;
}

const SelectionIndicatorRender = React.memo(function SelectionIndicatorRender(
    props: ISelectionIndicatorRenderProps
): JSX.Element {
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

                    return (
                        <div
                            key={`${selection.firstColumnKey}_${selection.lastColumnKey}`}
                            className={className}
                            style={{
                                gridColumnStart: selection.gridColumnStart,
                                gridColumnEnd: selection.gridColumnEnd,
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
                />
            );
        }
    }

    return null;
};

const SelectionIndicatorMemo = React.memo(SelectionIndicator);
export default SelectionIndicatorMemo;
