import { GridCell } from 'Controls/gridDisplay';
import { ICellComponentProps, IColumnConfig } from 'Controls/_grid/dirtyRender/cell/interface';
import * as React from 'react';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import { BaseEditingComponent } from 'Controls/baseList';

// Нужно править все использования класса выравнивания в EditingTemplate, чтобы убрать эту совместимость
const ALIGN_COMPATIBLE = {
    start: 'left',
    end: 'right',
    left: 'left',
    right: 'right',
    center: null,
    undefined: null,
};

export function getEditableTemplate(
    cell: GridCell,
    cellProps: ICellComponentProps,
    render: React.ReactNode
) {
    const cellConfig = cell.config as unknown as IColumnConfig;
    const editingConfig = cell.getEditingConfig();
    const templateOptions = cellConfig?.templateOptions ?? {};
    const editorRender = cellConfig?.editorTemplate
        ? templateLoader(cellConfig?.editorTemplate, {
              column: cell,
              gridColumn: cell,
              ...cellProps,
              ...templateOptions,
              item: cell.getOwner(),
          })
        : cellConfig?.editorRender;
    return (
        <BaseEditingComponent
            isReact={true}
            fontSize={cellProps.fontSize}
            viewRender={render}
            editorRender={editorRender}
            editing={cell.isEditing()}
            editingMode={editingConfig.mode}
            active={cell.isActive()}
            halign={ALIGN_COMPATIBLE[cellProps.halign]}
            inputBackgroundVisibility={editingConfig.inputBackgroundVisibility}
            inputBorderVisibility={editingConfig.inputBorderVisibility}
        />
    );
}
