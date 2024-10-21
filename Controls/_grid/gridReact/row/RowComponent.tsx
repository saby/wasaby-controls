/*
 * Файл содержит компонент ряда списка, а также вспомогательные функции, необходимые этому компоненту
 */
import * as React from 'react';
import { FocusRoot } from 'UI/Focus';

import { Model } from 'Types/entity';

import { getItemEventHandlers } from 'Controls/baseList';
import type { GridCell } from 'Controls/grid';
import { StickyGroup } from 'Controls/stickyBlock';

import { default as DefaultCellComponent } from 'Controls/_grid/dirtyRender/cell/CellComponent';
import { IColumnConfig, ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';
import CheckboxComponent from 'Controls/_grid/gridReact/components/CheckboxComponent';
import StickyLadderCellComponent from 'Controls/_grid/dirtyRender/cell/StickyLadderCellComponent';
import { GridStickyLadderCell as StickyLadderCell } from 'Controls/gridDisplay';
import { ChainOfRef } from 'UICore/Ref';
import { getCellComponentMasterStyleProps } from 'Controls/_grid/compatibleLayer/utils/masterDecorationStyleUtils';
import { getGroupCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Group';
import { getRowSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/RowSeparator';
import { getColumnSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
import { CellComponentStickyItemActions } from 'Controls/_grid/dirtyRender/cell/CellComponentStickyItemActions';
import { getDirtyCellComponentContentRender } from './dirty/DirtyCellComponentContentRenderResolver';
import { getCompatibleCellComponent } from 'Controls/_grid/gridReact/row/compatible/CompatibleCellComponentResolver';
import { getCleanCellComponent } from 'Controls/_grid/gridReact/row/clean/CleanCellComponentResolver';
import { shouldDisplayEditArrow } from 'Controls/_grid/cleanRender/cell/utils/Props/EditArrow';
import { isGroupCell, isTreeGroupNodeCell } from 'Controls/_grid/utils/Type';

/*
 * Функция, для рассчета классов, навешиваемых на верхний элемент ряда
 */
function getClassName({
    hoverBackgroundStyle,
    item,
    checkboxVisibility,
    borderVisibility,
    hoverMode,
    highlightOnHover,
    className = '',
    showItemActionsOnHover = true,
    actionsPosition,
}: IRowComponentProps): string {
    // Этот класс вешаем только для строк с данными, и групп
    // у строк групп в item может быть строка, 0, null или false.
    if (item !== undefined) {
        className += ' controls-ListView__itemV';
    }
    className += ' controls-GridReact__row';
    className += ' tw-contents';
    className += ` controls-GridReact__row__hoverMode_${hoverMode}`;
    className += ' js-controls-Grid__data-row';

    // TODO Тут совместимость для отображения опций записи в произвольном месте шаблона,
    //  эту опцию можно было бы заменить на что-то получше.

    if (showItemActionsOnHover) {
        // Прикладник использует .controls-ListView__item_showActions
        className +=
            ` controls-GridView__item_showActions controls-GridView__item_showActions_${hoverMode}` +
            ` controls-ListView__item_showActions_${actionsPosition}`;
    }

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

function getCellComponent(
    cell: GridCell,
    cellProps: ICellComponentProps,
    rowProps: IRowComponentProps,
    activateRef?: React.RefObject<HTMLElement>,
    tabIndex?: number
): React.ReactElement {
    const cellConfig = cell.config as unknown as IColumnConfig;

    const multiSelectTemplate = (props) => (
        <CheckboxComponent
            className={props.className}
            paddingBottom={rowProps.paddingBottom}
            paddingTop={rowProps.paddingTop}
            activateRef={activateRef}
            decorationStyle={rowProps.decorationStyle}
            render={rowProps.multiSelectRender}
        />
    );

    // Если itemActions выводятся в отдельной ячейке в стики-блоке - не рендерим itemActions внутри всех остальных ячеек
    if (
        cell.getOwner().hasItemActionsSeparatedCell() &&
        cell['[Controls/_display/grid/ItemActionsCell]']
    ) {
        return (
            <CellComponentStickyItemActions
                key={cell.key}
                actionsVisibility={cellProps.actionsVisibility}
                actionHandlers={cellProps.actionHandlers}
                hoverBackgroundStyle={cellProps.hoverBackgroundStyle}
                actionsClassName={cellProps.actionsClassName}
                actionsPosition={cellProps.actionsPosition}
                backgroundStyle={cellProps.backgroundColorStyle || cellProps.backgroundStyle}
            />
        );
    }

    // Если в конфиге колонки не задан render, то возможно мы в слое совместимости.
    // Пробуем вычислить компонент для слоя совместимости.
    if (cellConfig.render === undefined) {
        const _getCompatibleCellComponent =
            rowProps._$getCompatibleCellComponent ?? getCompatibleCellComponent;
        const compatibleCellComponent = _getCompatibleCellComponent(
            cell,
            cellProps,
            rowProps,
            multiSelectTemplate,
            rowProps.beforeContentRender
        );

        if (compatibleCellComponent !== undefined) {
            return compatibleCellComponent as React.ReactElement;
        }
    }

    // getCleanCellComponent возвращает максимально чистый и правильный react-компонент ячейки.
    // Под чистым понимается цельный, итоговый, вставляемый без доп. оберток и расчётов react-компонент ячейки.
    // Сейчас чистыми реализованы компоненты headerCell, footerCell, resultsCell, nodeFooterCell.
    const _getCleanCellComponent = rowProps._$getCleanCellComponent ?? getCleanCellComponent;
    const cleanCellComponent = _getCleanCellComponent(cell, rowProps);

    if (cleanCellComponent) {
        return cleanCellComponent;
    }

    // Иначе создается универсальная, "грязная" обертка FunctionalCellComponent, в которую вставляется
    // "грязный контент", получаемый через функцию "getDirtyCellComponentContentRender".
    const FunctionalCellComponent = rowProps._$FunctionalCellComponent || DefaultCellComponent;

    const _getDirtyCellComponentContentRender =
        rowProps._$getDirtyCellComponentContentRender ?? getDirtyCellComponentContentRender;
    const cellContentRender = _getDirtyCellComponentContentRender(
        cell,
        cellProps,
        multiSelectTemplate
    );

    // После перевода ВСЕХ компонентов ячеек на наследника BaseCellComponent - опцию "render" нужно удалить,
    // новое название опции "contentRender", т.к. такое название более точно описывает назначение опции.
    return (
        <FunctionalCellComponent
            key={cell.key}
            {...cellProps}
            cCountStart={rowProps.cCountStart}
            cCountEnd={rowProps.cCountEnd}
            render={cellContentRender}
            contentRender={cellContentRender}
            tabIndex={tabIndex}
        />
    );
}

/*
    *** ЗАГОТОВКА, КОТОРАЯ НУЖНА БУДЕТ ПРИ УДАЛЕНИИ КОДА ИЗ КОЛЛЕКЦИИ (cell.getCellComponentProps) ***
    Функция, возвращающая параметры ячейки, наследуемые от строки.
    Они должны перекрывать дефолтные значения параметров ячейки, но наиболее приоритетными являются параметры, заданные
    непосредственно на самой ячейке (через cellProps и getCellProps).
*/
/*
function getCellPropsInheritedFromRow(rowProps: IRowComponentProps): Partial<ICellComponentProps> {
    const inheritedPropsNames: string[] = [
        'paddingLeft',
        'paddingRight',
        'paddingBottom',
        'paddingTop',
        'backgroundStyle',
    ];

    const inheritedProps: Record<string, any> = {};

    inheritedPropsNames.forEach((propName: string) => {
        if ((rowProps as Record<string, any>)[propName] !== undefined) {
            inheritedProps[propName] = (rowProps as Record<string, any>)[propName];
        }
    });

    return inheritedProps as Partial<ICellComponentProps>;
}*/

/*
 * Метод, для получения пропсов ячейки и рассчета контента ячейки (render)
 */
function getCellComponentProps(cell: GridCell, rowProps: IRowComponentProps): ICellComponentProps {
    if (isGroupCell(cell)) {
        return getGroupCellComponentProps({
            cell,
            row: cell.getOwner(),
            rowProps,
        }) as ICellComponentProps;
    }

    let cellComponentProps = cell.getCellComponentProps(rowProps);

    cellComponentProps.dataQa = cell.listElementName;
    cellComponentProps.decorationStyle = rowProps.decorationStyle;

    // TODO пропсы для TreeGroupNodeCell должны считаться отдельно и независимо от GroupCell,
    //  Надо вынести в treeGrid
    if (isTreeGroupNodeCell(cell)) {
        cellComponentProps = {
            ...getGroupCellComponentProps({ cell, row: cell.getOwner(), rowProps }),
            ...cellComponentProps,
        };
    }

    if (cell['[Controls/_display/grid/CheckboxCell]']) {
        cellComponentProps = {
            ...cellComponentProps,
            ...getRowSeparators({ cell, row: cell.getOwner() }),
        };

        cellComponentProps.className += ` controls-Grid__row-cell-checkbox-${rowProps.decorationStyle}`;
    }

    if (cell['[Controls/_display/grid/DataCell]']) {
        cellComponentProps = {
            ...cellComponentProps,
            ...getRowSeparators({ cell, row: cell.getOwner() }),
            ...getColumnSeparators({ cell }),
            showEditArrow: shouldDisplayEditArrow({ cell, row: cell.getOwner() }),
        };
    }

    // Если itemActions выводятся в отдельной ячейке в стики-блоке - не рендерим itemActions внутри всех остальных ячеек
    if (cell.getOwner().hasItemActionsSeparatedCell()) {
        if (cell['[Controls/_display/grid/ItemActionsCell]']) {
            cellComponentProps.actionsVisibility = rowProps.actionsVisibility;
            cellComponentProps.actionHandlers = rowProps.actionHandlers;

            if (!cellComponentProps.hoverBackgroundStyle) {
                cellComponentProps.hoverBackgroundStyle = rowProps.hoverBackgroundStyle;
            }

            if (!cellComponentProps.actionsClassName) {
                cellComponentProps.actionsClassName = rowProps.actionsClassName;
            }
        } else {
            cellComponentProps.actionsVisibility = 'hidden';
        }
    }

    // стили master применяются на ячейки с данными и ячейки с чекбоксами.
    if (
        rowProps.decorationStyle === 'master' &&
        (cell['[Controls/_display/grid/DataCell]'] || cell['[Controls/_display/grid/CheckboxCell]'])
    ) {
        cellComponentProps = {
            ...cellComponentProps,
            ...getCellComponentMasterStyleProps(cell, cellComponentProps),
        };
    }

    return cellComponentProps;
}

/*
 * Компонент ряда
 */
function GridReactRowComponent(props: IRowComponentProps, ref): React.ReactElement {
    const focusRootRef = React.useRef<HTMLElement>();
    // Чтобы не потерять deactivatedRef, передаваемый в props, объединяем ref'ы утилитой ChainOfRef
    const finalRef = React.useMemo(() => {
        const mergedDeactivatedAndFocusRefs = ChainOfRef.both(
            props.deactivatedRef,
            focusRootRef
        ) as React.RefObject<HTMLElement>;
        return ChainOfRef.both(mergedDeactivatedAndFocusRefs, ref) as React.RefObject<HTMLElement>;
    }, [props.deactivatedRef, focusRootRef.current]);

    let cells: React.ReactElement[] = [];

    props.cellsIterator((cell, index) => {
        if (cell.isHidden()) {
            cells.push(
                <div
                    data-qa="cell"
                    className="tw-hidden"
                    key={`hidden-cell-${cell.key}-${cell.getInstanceId()}`}
                ></div>
            );
            return;
        }
        let tabIndex;
        let activateRef;

        if (props.innerFocusElement && index === 0) {
            tabIndex = 0;
            activateRef = finalRef;
        }

        const cellComponentProps = getCellComponentProps(cell, props);
        const cellComponent = getCellComponent(
            cell,
            cellComponentProps,
            props,
            activateRef,
            tabIndex
        );

        if (cell['[Controls/_display/StickyLadderCell]']) {
            cells.push(
                <StickyLadderCellComponent
                    key={`sticky-${cell.key}-${cell.getInstanceId()}`}
                    cell={cell as StickyLadderCell}
                    render={cellComponent}
                />
            );
        } else {
            cells.push(cellComponent);
        }
    });

    if (props.cCountStart) {
        cells = cells.slice(0, props.cCountStart);
    } else if (props.cCountEnd) {
        cells = cells.slice(cells.length - props.cCountEnd);
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
            title={props.attrs?.title}
            className={getClassName(props)}
            item-key={props['item-key']}
            data-name={props['data-name']}
            data-qa={props['data-qa'] || 'row' || props.attrs?.['data-qa']}
            data-target={props.attrs?.['data-target']}
            type-data-qa={props.attrs?.['type-data-qa']}
            item-parent-key={props.attrs?.['item-parent-key']}
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

export default React.memo(React.forwardRef(GridReactRowComponent));
