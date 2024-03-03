import * as React from 'react';

import { createElement } from 'UICore/Jsx';

import type { GridEmptyCell, GridEmptyRow } from 'Controls/grid';
import { CollectionItemContext } from 'Controls/baseList';

import { IEmptyViewConfig } from 'Controls/_gridReact/cell/interface';

// Используется, чтобы вывести старый шаблон пустого представления в новом рендере.
// Как минимум нужно до переписывания emptyTemplate в ЭДО браузере.
export function CompatibleEmptyView(props: { cell: GridEmptyCell }) {
    const item = React.useContext(CollectionItemContext) as unknown as GridEmptyRow;
    const cell = props.cell;

    if (cell.config && (cell.config as IEmptyViewConfig).render) {
        return (cell.config as IEmptyViewConfig).render;
    }

    return createElement(cell.getTemplate(), {
        item,
        emptyViewColumn: cell,
    });
}
