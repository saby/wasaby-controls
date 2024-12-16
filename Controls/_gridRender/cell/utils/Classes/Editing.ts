import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';

export function getEditingClasses(
    props: Pick<
        IDataCellComponentProps,
        'isFirstCell' | 'isLastCell' | 'editing' | 'editable' | 'editingMode'
    >
) {
    let editingClasses = '';

    if (props.editingMode === 'cell') {
        editingClasses += ' controls-Grid__row-cell_editing-mode-single-cell';

        if (props.isFirstCell) {
            editingClasses += ' controls-Grid__row-cell_editing-mode-single-cell_first';
        }

        if (props.isLastCell) {
            editingClasses += ' controls-Grid__row-cell_editing-mode-single-cell_last';
        }

        if (props.editing) {
            editingClasses += ' controls-Grid__row-cell_single-cell_editing';
        } else {
            if (props.editable !== false) {
                editingClasses += ' controls-Grid__row-cell_single-cell_editable';
            } else {
                editingClasses +=
                    ' js-controls-ListView__notEditable controls-Grid__row-cell_single-cell_not-editable';
            }
        }
    }

    return editingClasses;
}
