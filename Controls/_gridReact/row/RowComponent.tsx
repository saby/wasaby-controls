import * as React from 'react';

import { Model } from 'Types/entity';

import { getItemEventHandlers } from 'Controls/baseList';
import { GridCell, GridHeaderCell } from 'Controls/grid';

import CellComponent from 'Controls/_gridReact/cell/CellComponent';
import {
    IColumnConfig,
    ICellComponentProps,
} from 'Controls/_gridReact/cell/interface';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';
import CheckboxComponent from 'Controls/_gridReact/components/CheckboxComponent';
import { useRenderData } from 'Controls/_gridReact/hooks/useRenderData';
import { getEditorRender } from './EditorRender';

function getClassName({
    actionsVisibility = 'hidden',
    hoverBackgroundStyle,
    item,
}: IRowComponentProps): string {
    let className = '';
    // Этот класс вешаем только для строк с данными
    if (item) {
        className += ' controls-ListView__itemV';
    }
    className += ' controls-GridReact__row';
    className += ' tw-contents';
    if (actionsVisibility !== 'hidden') {
        className += ' controls-ListView__item_showActions';
    }
    if (hoverBackgroundStyle !== 'none') {
        className += ' controls-ListView__item_highlightOnHover';
    }
    return className;
}

// думаю это не стоит мемоизировать, тут скорее всего дешевле перерисоваться
function DefaultCellRender(props: {
    displayProperty?: string | number;
}): React.ReactElement {
    const { renderValues } = useRenderData([props.displayProperty]);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{renderValues[props.displayProperty]}</>;
}

function getCellProps(
    cell: GridCell,
    rowProps: IRowComponentProps
): ICellComponentProps {
    const config = cell.config as unknown as IColumnConfig;

    // Считаем render тут, чтобы лишний код не тащить в либу grid.
    // В идеале render должен возвращаться из метода getCellComponentProps и считаться внутри
    let render;
    if (cell['[Controls/_display/grid/HeaderCell]']) {
        render = config?.render || (cell as GridHeaderCell).getCaption();
    } else if (cell.CheckBoxCell) {
        render = (
            <CheckboxComponent
                checkboxValue={rowProps.checkboxValue}
                checkboxReadonly={rowProps.checkboxReadonly}
                checkboxVisibility={rowProps.checkboxVisibility}
            />
        );
    } else {
        render = config?.render || (
            <DefaultCellRender displayProperty={cell.getDisplayProperty()} />
        );
    }

    const cellComponentProps = cell.getCellComponentProps(rowProps, render);

    if (cell.isEditable()) {
        cellComponentProps.render = getEditorRender(cell, cellComponentProps);
    }

    return cellComponentProps;
}

function RowComponent(props: IRowComponentProps): React.ReactElement {
    let cells = [];
    props.cellsIterator((cell) => {
        const cellProps = getCellProps(cell, props);
        cells.push(
            <CellComponent
                key={cell.key}
                {...cellProps}
                cCount={props.cCount}
                renderFakeHeader={props.renderFakeHeader}
            />
        );
    });

    if (props.cCount) {
        const lastCell = cells[cells.length - 1];
        cells = cells.slice(0, props.cCount);

        if (
            props.renderFakeHeader &&
            cells[cells.length - 1].key !== 'columnScroll_scrollableHeaderCell'
        ) {
            cells.push(lastCell);
        }
    }

    // Нужно забиндить обработчики на item
    // Нельзя использовать хук, т.к. внутри используются хуки
    // С делегированием избавимся от этого
    const handlers =
        props.item && props.handlers
            ? getItemEventHandlers(props.item as Model, props.handlers)
            : null;

    const ref = props.deactivatedRef || null;
    return (
        <div
            ref={ref}
            {...handlers}
            className={getClassName(props)}
            item-key={props.item?.getKey?.()}
            data-qa={props.dataQa || 'item'}
        >
            {cells}
        </div>
    );
}

export default React.memo(RowComponent);
