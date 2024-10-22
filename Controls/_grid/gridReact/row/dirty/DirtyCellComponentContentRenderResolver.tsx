/*
 * Метод возвращает рендер содержимого ячейки, который будет вставлен в опцию CellComponent.render.
 * Чаще всего тут дожен вернуться просто текст, иногда обёрнутый в дополнительный div, например для overflow.
 */
import { ColumnResizerCell, GridCell } from 'Controls/baseGrid';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import * as React from 'react';
import ResizerComponent from 'Controls/_grid/gridReact/components/ResizerComponent';
import { getEditableTemplate } from '../EditableTemplate';
import { groupConstants } from 'Controls/display';
import getDirtyDataCellComponentContentRender from 'Controls/_grid/utils/getDirtyDataCellComponentContentRender';

export function getDirtyCellComponentContentRender(
    cell: GridCell,
    cellProps: ICellComponentProps,
    MultiSelectTemplate: React.Component | React.FunctionComponent
) {
    if (cell.CheckBoxCell) {
        return <MultiSelectTemplate />;
    }

    if (cell['[Controls/grid/_display/ColumnResizerCell]']) {
        return (
            <ResizerComponent
                minOffset={(cell as ColumnResizerCell).getMinOffset()}
                maxOffset={(cell as ColumnResizerCell).getMaxOffset()}
                onOffset={(cell as ColumnResizerCell).getResizerOffsetCallback()}
            />
        );
    }

    if (cell['[Controls/_display/grid/SpaceCell]']) {
        return null;
    }

    // Группировка в плоской таблице
    if (cell['[Controls/_display/grid/GroupCell]']) {
        if ((cell.contents as unknown as string) === groupConstants.hiddenGroup) {
            return null;
        }
        return cellProps.contentRender || cell.getDefaultDisplayValue();
    }

    // Прикладник передаёт в Grid.View опцию emptyView.
    // Содержимое её - список колонок для построения пустого представления.
    // Control прописывает emptyView в emptyTemplateColumns. и уже там решается, что в columnConfig.render
    // лежит тот самый рендер, который хочет показать прикладник.
    if (cell['[Controls/_display/grid/EmptyCell]']) {
        const columnConfig = cell.getColumnConfig();
        if (columnConfig.render) {
            return columnConfig.render;
        }
    }

    if (cell["[Controls/_display/grid/DataCell]"]) {
      const cellConfig = cell.config;
      const dataCellContentRender = getDirtyDataCellComponentContentRender(
        cell,
        cellProps
      );

      if (cell.isEditable() && cellConfig?.editorRender) {
        return getEditableTemplate(cell, cellProps, dataCellContentRender);
      }

      return dataCellContentRender;
  }

    return null;
}
