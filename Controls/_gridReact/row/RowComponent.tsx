import * as React from 'react';

import { Model } from 'Types/entity';

import { getItemEventHandlers } from 'Controls/baseList';
import { GridCell, GridHeaderCell, ColumnResizerCell } from 'Controls/grid';
import { TOverflow } from 'Controls/interface';
import { StickyGroup } from 'Controls/stickyBlock';

import CellComponent, {
    getVerticalPaddingsClassName,
} from 'Controls/_gridReact/cell/CellComponent';
import { IColumnConfig, ICellComponentProps } from 'Controls/_gridReact/cell/interface';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';
import CheckboxComponent from 'Controls/_gridReact/components/CheckboxComponent';
import ResizerComponent from 'Controls/_gridReact/components/ResizerComponent';
import { useItemData } from 'Controls/_gridReact/hooks/useItemData';
import { getEditorRender } from './EditorRender';
import { CompatibleEmptyView } from 'Controls/_gridReact/emptyView/CompatibleEmptyView';

function getClassName({
    actionsVisibility = 'hidden',
    hoverBackgroundStyle,
    item,
    checkboxVisibility,
    borderVisibility,
    hoverMode,
}: IRowComponentProps): string {
    let className = '';
    // Этот класс вешаем только для строк с данными
    if (item) {
        className += ' controls-ListView__itemV';
    }
    className += ' controls-GridReact__row';
    className += ' tw-contents';
    className += ` controls-GridReact__row__hoverMode_${hoverMode}`;

    // Пока не поддерживваем вывод операций над записью при ховере в ограниченной области шаблона.
    // См showItemActionsOnHover.
    className += ' controls-ListView__item_showActions';

    if (checkboxVisibility !== 'hidden') {
        className += ' controls-ListView__item_showCheckbox';
    }
    if (hoverBackgroundStyle !== 'none') {
        className += ' controls-ListView__item_highlightOnHover';
    }
    if (borderVisibility === 'onhover') {
        // Класс требуется для унифицирования CSS селектора показа границы по ховеру.
        // Селекторы стиля границы по ховеру для ячейки и для всей строки ДОЛЖНЫ быть разными.
        // В противном случае, Recalculate Styles берет ненужные элементы и раздувается.
        className += ' controls-GridReact__row-border_onhover';
    }
    return className;
}

// думаю это не стоит мемоизировать, тут скорее всего дешевле перерисоваться
function DefaultCellRender(props: {
    displayProperty?: string | number;
    textOverflow?: TOverflow;
}): React.ReactElement {
    const { renderValues } = useItemData([props.displayProperty]);
    const value = renderValues[props.displayProperty];
    if (props.textOverflow && props.textOverflow === 'ellipsis') {
        return <div className={'tw-truncate'}>{value}</div>;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{value}</>;
}

function getCellProps(cell: GridCell, rowProps: IRowComponentProps): ICellComponentProps {
    const config = cell.config as unknown as IColumnConfig;
    // Считаем render тут, чтобы лишний код не тащить в либу grid.
    // В идеале render должен возвращаться из метода getCellComponentProps и считаться внутри
    let render;
    if (cell['[Controls/_display/grid/HeaderCell]']) {
        render = config?.render || (cell as GridHeaderCell).getCaption();
    } else if (cell.CheckBoxCell) {
        const checkboxClassName = getVerticalPaddingsClassName(
            rowProps.paddingTop,
            rowProps.paddingBottom
        );
        render = <CheckboxComponent className={checkboxClassName} />;
    } else if (cell['[Controls/grid/_display/ColumnResizerCell]']) {
        render = (
            <ResizerComponent
                minOffset={(cell as ColumnResizerCell).getMinOffset()}
                maxOffset={(cell as ColumnResizerCell).getMaxOffset()}
                onOffset={(cell as ColumnResizerCell).getResizerOffsetCallback()}
            />
        );
    } else if (cell['[Controls/_display/grid/EmptyCell]']) {
        render = <CompatibleEmptyView cell={cell} />;
    } else if (cell['[Controls/_display/grid/SpaceCell]']) {
        render = null;
    } else {
        // Если задан null, то нужно так и оставить null. null - это валидное значение в реакте,
        // которое позволяет ничего не строить.
        render =
            config?.render !== undefined ? (
                config?.render
            ) : (
                <DefaultCellRender
                    displayProperty={cell.getDisplayProperty()}
                    textOverflow={cell.getTextOverflow()}
                />
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
        cells.push(<CellComponent key={cell.key} {...cellProps} cCount={props.cCount} />);
    });

    if (props.cCount) {
        cells = cells.slice(0, props.cCount);
    }

    // Нужно забиндить обработчики на item
    // Нельзя использовать хук, т.к. внутри используются хуки
    // С делегированием избавимся от этого
    const handlers = props.handlers
        ? getItemEventHandlers(props.item as Model, props.handlers)
        : null;

    const ref = props.deactivatedRef || null;
    // Даже если нет ячеек мы должна строить запись, т.к. виртуальный скролл ее ждет.
    // Если записи не должно быть, то ее не должна создавать коллекция.
    const rowElement = (
        <div
            ref={ref}
            {...handlers}
            className={getClassName(props)}
            item-key={props['item-key']}
            data-qa={props['data-qa'] || 'row'}
        >
            {cells}
        </div>
    );

    if (props.stickyPosition) {
        return (
            <StickyGroup
                position={props.stickyPosition}
                fixedPositionInitial={props.fixedPositionInitial}
            >
                {rowElement}
            </StickyGroup>
        );
    }

    return rowElement;
}

export default React.memo(RowComponent);
