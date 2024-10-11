/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { useHandler } from 'Controls/Hooks/useHandler';
import { RowSelectionContext } from '../selectionContext/rowSelectionContext/RowSelectionContext';
import { TColumnKey } from '../shared/types';
import { MultiSelectAccessibility } from 'Controls/display';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export interface ISelectionCheckboxProps {
    columnKey: TColumnKey;
    className?: string;
}

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
        rowCtx.isSelectionInitialized &&
        rowCtx.getMultiSelectAccessibility(props.columnKey) !== MultiSelectAccessibility.hidden
    ) {
        const Checkbox = loadSync('Controls/checkbox').CheckboxMarker;
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

const SelectionCheckboxMemo = React.memo((props: ISelectionCheckboxProps) => {
    const rowCtx = React.useContext(RowSelectionContext);
    if (!rowCtx) {
        return null;
    }
    return <SelectionCheckbox {...props} />;
});
export default SelectionCheckboxMemo;
