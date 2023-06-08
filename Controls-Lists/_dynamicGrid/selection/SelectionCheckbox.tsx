import * as React from 'react';
import { TColumnKey } from './interfaces';
import { GridSelectionContext } from './gridContext/GridSelectionContext';
import { RowSelectionContext } from './rowContext/RowSelectionContext';
import { CheckboxMarker } from 'Controls/checkbox';

export interface ISelectionCheckboxProps {
    columnKey: TColumnKey;
}

const SelectionCheckboxRender = React.memo(function SelectionCheckboxRender(
    props: ISelectionCheckboxProps
): JSX.Element {
    const rowCtx = React.useContext(RowSelectionContext);
    return (
        <CheckboxMarker
            value={rowCtx.isSelected(props.columnKey)}
            onClick={() => rowCtx.handleSelection(props.columnKey)}
        />
    );
});

export const SelectionCheckbox = React.memo(function SelectionCheckbox(
    props: ISelectionCheckboxProps
) {
    const gridCtx = React.useContext(GridSelectionContext);

    if (gridCtx.isEnabled) {
        return <SelectionCheckboxRender columnKey={props.columnKey} />;
    } else {
        return null;
    }
});
