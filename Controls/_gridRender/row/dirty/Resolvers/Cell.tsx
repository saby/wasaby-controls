/*
 * Метод возвращает рендер содержимого ячейки, который будет вставлен в опцию CellComponent.render.
 * Чаще всего тут дожен вернуться просто текст, иногда обёрнутый в дополнительный div, например для overflow.
 */
import { ColumnResizerCell, GridCell } from 'Controls/gridDisplay';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import * as React from 'react';
import ResizerComponent from 'Controls/_gridRender/components/Resizer';
import { getEditableTemplate } from '../../utils/Resolvers/Editor';
import { groupConstants } from 'Controls/display';
import contentRenderResolver from 'Controls/_gridRender/cell/dirty/ContentRenderResolver';

export function getDirtyCellComponentContentRender(
    cell: GridCell,
    cellProps: ICellComponentProps,
    MultiSelectTemplate: React.Component | React.FunctionComponent
) {
    if (cell.CheckBoxCell) {
        return <MultiSelectTemplate />;
    }

    if (cell.$GCRC) {
        return (
            <ResizerComponent
                minOffset={(cell as ColumnResizerCell).getMinOffset()}
                maxOffset={(cell as ColumnResizerCell).getMaxOffset()}
                onOffset={(cell as ColumnResizerCell).getResizerOffsetCallback()}
            />
        );
    }

    if (cell.$GSC) {
        return null;
    }

    // Группировка в плоской таблице
    if (cell.$GGC) {
        if ((cell.contents as unknown as string) === groupConstants.hiddenGroup) {
            return null;
        }
        return cellProps.contentRender || cell.getDefaultDisplayValue();
    }

    // Прикладник передаёт в Grid.View опцию emptyView.
    // Содержимое её - список колонок для построения пустого представления.
    // Control прописывает emptyView в emptyTemplateColumns. и уже там решается, что в columnConfig.render
    // лежит тот самый рендер, который хочет показать прикладник.
    if (cell.$GEC) {
        const columnConfig = cell.getColumnConfig();
        if (columnConfig.render) {
            return columnConfig.render;
        }
    }

    if (cell.$GDC) {
        const cellConfig = cell.config;
        const dataCellContentRender = contentRenderResolver(cell, cellProps);

        if (cell.isEditable() && cellConfig?.editorRender) {
            return getEditableTemplate(cell, cellProps, dataCellContentRender);
        }

        return dataCellContentRender;
    }

    return null;
}
