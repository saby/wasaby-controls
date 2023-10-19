import * as React from 'react';
import { useHandler } from 'Controls/Hooks/useHandler';
import { RowSelectionContext } from '../selectionContext/rowSelectionContext/RowSelectionContext';
import { CheckboxMarker } from 'Controls/checkbox';
import { TColumnKey } from '../shared/types';
import { MultiSelectAccessibility } from 'Controls/display';

export interface ISelectionCheckboxProps {
    columnKey: TColumnKey;
    className?: string;
}

const Checkbox = React.memo(CheckboxMarker);

export const SelectionCheckbox = function SelectionCheckbox(props: ISelectionCheckboxProps) {
    const rowCtx = React.useContext(RowSelectionContext);
    const onClick = useHandler(
        React.useCallback<React.MouseEventHandler>(
            (e) => {
                e.stopPropagation();
                rowCtx.contextRefForHandlersOnly.current.handleSelection(props.columnKey);
            },
            [props.columnKey]
        )
    );

    if (
        rowCtx.isEnabled &&
        rowCtx.getMultiSelectAccessibility(props.columnKey) !== MultiSelectAccessibility.hidden
    ) {
        return (
            <Checkbox
                value={rowCtx.isSelected(props.columnKey)}
                onClick={onClick}
                className={props.className}
                horizontalPadding={null}
            />
        );
    } else {
        return null;
    }
};

const SelectionCheckboxMemo = React.memo(SelectionCheckbox);
export default SelectionCheckboxMemo;
