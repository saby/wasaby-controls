import type { GridCell } from 'Controls/gridDisplay';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { IColumnConfig } from 'Controls/_gridRender/cell/interface/IColumnConfig';
import * as React from 'react';
import { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
import getVisualComponent from '../../../utils/getVisualComponent';

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
    const BaseEditingComponent = getVisualComponent('BaseEditingComponent');

    if (!BaseEditingComponent) {
        return null;
    }

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
              // внутрь никаким образом не должны попадать классы от самой ячейки, иначе они задублируются
              // https://online.sbis.ru/opendoc.html?guid=3933742f-e06e-4af8-bab6-61ca25cc895d
              className: '',
          })
        : cellConfig?.editorRender;
    return (
        <BaseEditingComponent
            isReact={true}
            fontSize={cellProps.fontSize}
            highlightEditor={cellProps.highlightEditor}
            viewRender={render}
            editorRender={editorRender}
            editing={cell.isEditing()}
            editingMode={editingConfig.mode}
            active={cell.isActive()}
            halign={ALIGN_COMPATIBLE[cellProps.halign]}
            inputBackgroundVisibility={
                // Прикладник может указать inputBackgroundVisibility в getCellProps, если ему нужно отключить фон
                // если ему нужно отключить фон для какой-то конкретной ячейки
                // https://online.sbis.ru/opendoc.html?guid=6046491b-9cf6-4299-8fbf-9c9300977984&client=3
                cell.cellProps?.inputBackgroundVisibility ?? editingConfig.inputBackgroundVisibility
            }
            inputBorderVisibility={editingConfig.inputBorderVisibility}
        />
    );
}
