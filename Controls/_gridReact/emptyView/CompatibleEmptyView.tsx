/*
 * Файл содержит компонент для совместимости пустого представления
 */

import * as React from 'react';
import type { GridEmptyCell, GridEmptyRow } from 'Controls/grid';
import { CollectionItemContext } from 'Controls/baseList';
import { IEmptyViewConfig } from 'Controls/_gridReact/cell/interface';
import { templateLoader } from 'Controls/_gridReact/utils/templateLoader';

/*
 * Используется, чтобы вывести старый шаблон пустого представления в новом рендере.
 * Как минимум нужно до переписывания emptyTemplate в ЭДО браузере.
 */
export function CompatibleEmptyView(props: { cell: GridEmptyCell }) {
    const item = React.useContext(CollectionItemContext) as unknown as GridEmptyRow;
    const cell = props.cell;

    if (cell.config && (cell.config as IEmptyViewConfig).render) {
        return (cell.config as IEmptyViewConfig).render;
    }

    return templateLoader(cell.getTemplate(), {
        item,
        emptyViewColumn: cell,
    });
}
