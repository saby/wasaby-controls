import * as React from 'react';
import {
    CellComponent as BaseCellComponent,
    CellPropsUtils,
    GridCell,
    ICellComponentProps,
    IRowComponentProps,
    templateLoader,
} from 'Controls/grid';
import {
    RowComponent as TreeGridRowComponent,
    getCompatibleCellComponent as getCompatibleTreeGridCellComponent,
    getCleanCellComponent as getCleanTreeGridCellComponent,
    getDirtyCellComponentContentRender as getDirtyTreeGridCellComponentContentRender,
} from 'Controls/treeGrid';
import { IBeforeContentRenderProps } from 'Controls/grid';
import PathComponent from 'Controls/_searchBreadcrumbsGrid/cleanRender/PathComponent';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import SearchSeparatorCell from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorCell';
import { getSearchBreadcrumbsProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/utils/SearchBreadcrumbs';
import SearchBreadcrumbsCellComponent from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchBreadcrumbsCellComponent';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import { ISearchBreadcrumbsTreeGridRowComponentProps } from 'Controls/_searchBreadcrumbsGrid/row/interface';
import { getSearchSeparatorCellComponentProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/utils/SearchSeparator';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import SearchSeparatorCellComponent from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchSeparatorCellComponent';
import { getRowSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/RowSeparator';

export function getCompatibleCellComponent(
    cell: GridCell,
    cellProps: ICellComponentProps,
    baseRowProps: ISearchBreadcrumbsTreeGridRowComponentProps,
    multiSelectTemplate: React.ReactElement,
    beforeContentRender?: React.FunctionComponent<IBeforeContentRenderProps>
): React.ReactElement | null | undefined {
    const rowProps = { ...baseRowProps };
    delete rowProps['data-qa'];
    delete rowProps.attrs;

    if (cell['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]']) {
        const breadcrumbsCell = cell as unknown as BreadcrumbsItemCell;

        // Шаблон хлебных всегда рендерим только в первой ячейке,
        // остальные ячейки рендерятся через обычный прикладной шаблон.
        if (CellPropsUtils.isFirstDataCell(breadcrumbsCell)) {
            // Рендерим прикладной шаблон хлебных крошек
            if (rowProps?.searchBreadCrumbsItemTemplate) {
                const templateProps = {
                    column: cell,
                    gridColumn: cell,
                    ...rowProps,
                    ...cellProps,
                    className: cellProps.className || '',
                    ...cell.config.templateOptions,
                    item: cell.getOwner(),
                    itemData: cell,
                    key: cell.key,
                };
                // Подчищаем перебивки на undefined
                if (!templateProps.className) {
                    delete templateProps.className;
                }
                if (!cellProps.highlightOnHover) {
                    delete cellProps.highlightOnHover;
                }

                return templateLoader(rowProps?.searchBreadCrumbsItemTemplate, templateProps);
            }

            // По умолчанию, выходим, чтобы отрендерился "clean render"
            return;
        }

        // Далее в строке хлебной крошки могут отрендерить какой-то свой шаблон ячейки, на это есть автотест.
        // Однако, мы не должны разрешать рендерить прикладной шаблон ячейки,
        // если breadcrumbsCell.getBreadCrumbsMode() !== 'cell'
        if (breadcrumbsCell.getBreadCrumbsMode() !== 'cell') {
            return;
        }
    }

    if (cell['[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]']) {
        if (!CellPropsUtils.isFirstDataCell(cell)) {
            const FunctionalCellComponent = rowProps._$FunctionalCellComponent || BaseCellComponent;
            return (
                <FunctionalCellComponent
                    key={cell.key}
                    {...cellProps}
                    {...getRowSeparators({ cell, row: cell.getOwner() })}
                    cCount={rowProps.cCount}
                    render={null}
                    tabIndex={-1}
                />
            );
        }
        // По умолчанию, выходим, чтобы отрендерился "clean render"
        return;
    }

    return getCompatibleTreeGridCellComponent(
        cell,
        cellProps,
        baseRowProps,
        multiSelectTemplate,
        beforeContentRender
    );
}

export function getDirtyCellComponentContentRender(
    cell: GridCell,
    cellProps: ICellComponentProps,
    multiSelectTemplate: React.ReactElement
): React.ReactElement {
    if (cell['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]']) {
        const breadcrumbsCell = cell as unknown as BreadcrumbsItemCell;

        if (CellPropsUtils.isFirstDataCell(breadcrumbsCell)) {
            return React.createElement(PathComponent, breadcrumbsCell.getBreadcrumbsPathProps());
        }

        if (breadcrumbsCell.getBreadCrumbsMode() !== 'cell') {
            return null;
        }
    }

    if (cell['[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]']) {
        return null;
    }

    return getDirtyTreeGridCellComponentContentRender(cell, cellProps, multiSelectTemplate);
}

// getCleanCellComponent возвращает максимально чистый и правильный react-компонент ячейки.
// Под чистым понимается цельный, итоговый, вставляемый без доп. оберток и расчётов react-компонент ячейки.
// Сейчас чистыми реализованы компоненты headerCell, footerCell, resultsCell, nodeFooterCell.
export function getCleanCellComponent(
    cell: GridCell,
    rowProps?: IRowComponentProps
): React.ReactElement {
    if (
        cell['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]'] &&
        CellPropsUtils.isFirstDataCell(cell)
    ) {
        const searchBreadcrumbsProps = getSearchBreadcrumbsProps({
            cell: cell as unknown as BreadcrumbsItemCell,
            row: cell.getOwner() as unknown as BreadcrumbsItemRow,
            rowProps,
        });

        return <SearchBreadcrumbsCellComponent {...searchBreadcrumbsProps} key={cell.key} />;
    }

    if (
        cell['[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]'] &&
        CellPropsUtils.isFirstDataCell(cell)
    ) {
        const searchSeparatorProps = getSearchSeparatorCellComponentProps({
            cell: cell as unknown as SearchSeparatorCell,
            row: cell.getOwner() as unknown as SearchSeparatorRow,
        });

        return <SearchSeparatorCellComponent {...searchSeparatorProps} key={cell.key} />;
    }

    return getCleanTreeGridCellComponent(cell, rowProps);
}

/*
 * Компонент ряда
 */
function SearchBreadcrumbsGridRowComponent(
    props: ISearchBreadcrumbsTreeGridRowComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <TreeGridRowComponent
            {...props}
            ref={ref}
            _$getCompatibleCellComponent={getCompatibleCellComponent}
            _$getCleanCellComponent={getCleanCellComponent}
            _$getDirtyCellComponentContentRender={getDirtyCellComponentContentRender}
        />
    );
}

export default React.memo(React.forwardRef(SearchBreadcrumbsGridRowComponent));
