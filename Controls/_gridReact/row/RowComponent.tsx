/*
 * Файл содержит компонент ряда списка, а также вспомогательные функции, необходимые этому компоненту
 */

import * as React from 'react';
import { FocusRoot } from 'UI/Focus';

import { Model } from 'Types/entity';

import { getItemEventHandlers } from 'Controls/baseList';
import type { GridCell, ColumnResizerCell } from 'Controls/grid';
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
import StickyCell from 'Controls/_gridReact/cell/StickyCell';
import StickyLadderCell from 'Controls/_baseGrid/display/StickyLadderCell';
import { getDataCellRender } from 'Controls/_gridReact/row/DataCellRender';
import { getGroupBlockCellRender } from 'Controls/_gridReact/group/getGroupBlockCellRender';
import HeaderCellComponent from 'Controls/_grid/Render/HeaderCellComponent';
import { templateLoader } from 'Controls/_gridReact/utils/templateLoader';
import { FooterCellWithExpander } from 'Controls/_baseTree/render/FooterCellWithExpander';
import { ChainOfRef } from 'UICore/Ref';
import { getCellComponentMasterStyleProps } from 'Controls/_gridReact/utils/masterDecorationStyleUtils';

/*
 * Функция, для рассчета классов, навешиваемых на верхний элемент ряда
 */
function getClassName({
    actionsVisibility = 'hidden',
    hoverBackgroundStyle,
    item,
    checkboxVisibility,
    borderVisibility,
    hoverMode,
    highlightOnHover,
    className = '',
}: IRowComponentProps): string {
    // Этот класс вешаем только для строк с данными
    if (item) {
        className += ' controls-ListView__itemV';
    }
    className += ' controls-GridReact__row';
    className += ' tw-contents';
    className += ` controls-GridReact__row__hoverMode_${hoverMode}`;
    className += ' js-controls-Grid__data-row';

    // Пока не поддерживваем вывод операций над записью при ховере в ограниченной области шаблона.
    // См showItemActionsOnHover.
    className += ' controls-ListView__item_showActions';

    if (checkboxVisibility !== 'hidden') {
        className += ' controls-ListView__item_showCheckbox';
    }
    if (hoverBackgroundStyle !== 'none' && highlightOnHover !== false) {
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

/*
 * Компонент, для дефолтного отображения содержимого ячейки
 */
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

/*
 * Метод, для получения пропсов ячейки и рассчета контента ячейки (render)
 */
function getCellProps(
    cell: GridCell,
    rowProps: IRowComponentProps,
    activateRef?: React.RefObject<HTMLElement>
): ICellComponentProps {
    const config = cell.config as unknown as IColumnConfig;
    // Считаем render тут, чтобы лишний код не тащить в либу grid.
    // В идеале render должен возвращаться из метода getCellComponentProps и считаться внутри
    let render;
    if (rowProps.contentTemplate) {
        const { contentTemplate } = rowProps;
        render = templateLoader(contentTemplate, { column: cell, gridColumn: cell, ...rowProps });
    } else if (cell['[Controls/_display/grid/HeaderCell]']) {
        const templateOptions = config?.templateOptions ?? {};
        const headerTemplate = templateLoader(config?.template, {
            column: cell,
            gridColumn: cell,
            ...rowProps,
            ...templateOptions,
            item: cell.getOwner(),
        });
        render = config?.render || headerTemplate || (
            <HeaderCellComponent column={cell} {...rowProps} />
        );
    } else if (cell.CheckBoxCell) {
        const checkboxClassName =
            getVerticalPaddingsClassName(rowProps.paddingTop, rowProps.paddingBottom) +
            ' tw-box-border';

        render = (
            <CheckboxComponent
                className={checkboxClassName}
                activateRef={activateRef}
                decorationStyle={rowProps.decorationStyle}
                render={rowProps.multiSelectRender}
            />
        );
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
    } else if (config?.render !== undefined) {
        // Если задан null, то нужно так и оставить null. null - это валидное значение в реакте,
        // которое позволяет ничего не строить.
        render = config?.render;
    } else if (cell['[Controls/_display/grid/ResultsCell]']) {
        // В режиме совместимости и если не задан config?.render пытаемся отрендерить getTemplate
        render = templateLoader(cell.getTemplate(), {
            gridColumn: cell,
            column: cell,
            itemData: cell,
            colData: cell,
            children: config?.render,
            ...cell.getTemplateOptions(),
            attrs: {},
        });
    } else if (config?.reactContentTemplate !== undefined) {
        const { reactContentTemplate: ReactContentTemplate } = config;
        render = <ReactContentTemplate item={cell.getOwner()} column={cell} />;
    } else if (config?.template !== undefined) {
        const templateOptions = config?.templateOptions ?? {};
        render = templateLoader(config?.template, {
            column: cell,
            gridColumn: cell,
            ...rowProps,
            ...templateOptions,
            item: cell.getOwner(),
        });
    } else if (
        cell['[Controls/_display/grid/DataCell]'] &&
        cell.getDisplayType() &&
        cell.getDisplayProperty()
    ) {
        render = getDataCellRender(cell);
    } else {
        render = (
            <DefaultCellRender
                displayProperty={cell.getDisplayProperty()}
                textOverflow={cell.getTextOverflow()}
            />
        );
    }

    let cellComponentProps = cell.getCellComponentProps(rowProps, render);

    if (rowProps.decorationStyle === 'master' && cell['[Controls/_display/grid/DataCell]']) {
        cellComponentProps = getCellComponentMasterStyleProps(cell, cellComponentProps);
    }

    // Для работы groupViewMode необходима вложенность item->cell->wrapper->content
    // Причём отступы должны быть заданы на уровне wrapper, а не cell,
    // Чтобы wrapper перекрывал тени, заданные на cell
    if (
        !cell['[Controls/_display/grid/GroupCell]'] &&
        (rowProps.groupViewMode === 'blocks' || rowProps.groupViewMode === 'titledBlocks')
    ) {
        cellComponentProps.render = getGroupBlockCellRender(cell, cellComponentProps);
        cellComponentProps.paddingBottom = 'null';
        cellComponentProps.paddingTop = 'null';
        cellComponentProps.paddingLeft = 'null';
        cellComponentProps.paddingRight = 'null';
    }

    if (
        cell['[Controls/treeGrid:TreeGridNodeFooterCell]'] &&
        cellComponentProps.nodeFooterTemplate
    ) {
        cellComponentProps.render = templateLoader(cellComponentProps.nodeFooterTemplate, {
            gridColumn: cell,
            ...rowProps,
            item: cell.getOwner(),
        });
    }

    if (cell.isEditable()) {
        cellComponentProps.render = getEditorRender(cell, cellComponentProps);
    }

    if (cell.getHiddenForLadder()) {
        cellComponentProps.className += ' controls-Grid__ladder_sticky_background_cell';
        cellComponentProps.render = (
            <div style={{ visibility: 'hidden' }}>{cellComponentProps.render}</div>
        );
    }

    if (
        cellComponentProps?.expanderPadding ||
        (cell['[Controls/treeGrid:TreeGridNodeFooterCell]'] &&
            config.template &&
            !rowProps?.withoutExpanderPadding)
    ) {
        cellComponentProps.render = React.createElement(FooterCellWithExpander, {
            render: cellComponentProps.render,
            owner: cell.getOwner(),
        });
    }

    return cellComponentProps;
}

/*
 * Компонент ряда
 */
function RowComponent(props: IRowComponentProps): React.ReactElement {
    const focusRootRef = React.useRef<HTMLElement>();
    // Чтобы не потерять deactivatedRef, передаваемый в props, объединяем ref'ы утилитой ChainOfRef
    const finalRef = React.useMemo(
        () => ChainOfRef.both(props.deactivatedRef, focusRootRef) as React.RefObject<HTMLElement>,
        [props.deactivatedRef, focusRootRef.current]
    );

    let cells: React.ReactElement[] = [];

    props.cellsIterator((cell, index) => {
        let tabIndex;
        let activateRef;

        if (props.innerFocusElement && index === 0) {
            tabIndex = 0;
            activateRef = finalRef;
        }

        const cellProps = getCellProps(cell, props, activateRef);

        const cellRender = (
            <CellComponent
                key={cell.key}
                {...cellProps}
                cCount={props.cCount}
                tabIndex={tabIndex}
            />
        );

        if (cell['[Controls/_display/StickyLadderCell]']) {
            cells.push(
                <StickyCell key={cell.key} cell={cell as StickyLadderCell} render={cellRender} />
            );
        } else {
            cells.push(cellRender);
        }
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

    const groupItemKey =
        props.groupProperty && props?.item?.get?.(props.groupProperty)
            ? { 'item-group-key': props.item.get(props.groupProperty) }
            : null;

    // Даже если нет ячеек мы должна строить запись, т.к. виртуальный скролл ее ждет.
    // Если записи не должно быть, то ее не должна создавать коллекция.
    const rowElement = (
        <FocusRoot
            as={'div'}
            ref={finalRef}
            {...handlers}
            className={getClassName(props)}
            item-key={props['item-key']}
            data-qa={props['data-qa'] || 'row'}
            {...groupItemKey}
            tabIndex={props.tabIndex ?? 0}
        >
            {cells}
        </FocusRoot>
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
