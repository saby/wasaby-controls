/*
 * Файл содержит функцию, которая возвращает контент ячейки, находящейся в состоянии редактирования
 */

import * as React from 'react';
import { Logger } from 'UI/Utils';
import type { GridCell } from 'Controls/grid';
import { BaseEditingComponent } from 'Controls/baseList';
import { ICellComponentProps, IColumnConfig } from 'Controls/_gridReact/cell/interface';
import { templateLoader } from 'Controls/_gridReact/utils/templateLoader';

// Нужно править все использования класса выравнивания в EditingTemplate, чтобы убрать эту совместимость
const ALIGN_COMPATIBLE = {
    start: 'left',
    end: 'right',
    center: null,
    undefined: null,
};

/*
 * Функция, возвращающая контент ячейки, находящейся в состоянии редактирования
 */
export function getEditorRender(
    cell: GridCell,
    cellProps: ICellComponentProps
): React.ReactElement {
    const config = cell.config as unknown as IColumnConfig;
    if (!config.editorRender && !config.editorTemplate) {
        if (cell.isEditing()) {
            Logger.error(
                `Should set editorRender for cell with key or displayProperty "${cell.key}".`
            );
        }

        // Если для ячейки не задан editorRender, то EditingComponent точно не нужен
        return cellProps.render;
    }

    const editingConfig = cell.getEditingConfig();
    // Нужно использовать BaseEditingComponent, чтобы во viewRender выводить при ховере инпуты и нижний бордер инпутов
    // А также чтобы вертикально(слева или справа) выравнять текст во время редактирования и во время отображения
    // В теории можно оптимизировать и выравнивание утащить в класс на ячейке, тогда BaseEditingComponent использовать
    // только когда нужно по ховеру показать инпуты

    const templateOptions = config?.templateOptions ?? {};
    const render = config.editorRender
        ? config.editorRender
        : templateLoader(config?.editorTemplate, {
              column: cell,
              gridColumn: cell,
              ...cellProps,
              ...templateOptions,
              item: cell.getOwner(),
          });

    return (
        <BaseEditingComponent
            isReact={true}
            viewRender={cellProps.render}
            editorRender={render}
            editing={cell.isEditing()}
            editingMode={editingConfig.mode}
            active={cell.isActive()}
            halign={ALIGN_COMPATIBLE[cellProps.halign]}
            cellInputBackgroundVisible={cellProps.cellInputBackgroundVisible}
            inputBackgroundVisibility={editingConfig.inputBackgroundVisibility}
            inputBorderVisibility={editingConfig.inputBorderVisibility}
        />
    );
}
