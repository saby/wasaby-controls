/*
 * Метод возвращает переданный прикладником, и
 * обёрнутый у нас в слой совместимости CellComponent.
 * Компонент будет вставлен непосредственно в RowComponent при помощи cellIterator.
 */
import * as React from 'react';
import { Logger } from 'UI/Utils';
import {
    GridCell,
    GridFooterCell,
    GridFooterRow,
    GridEmptyRow,
    GridEmptyCell,
} from 'Controls/baseGrid';
import { CompatibleHeaderCellComponent } from 'Controls/_grid/compatibleLayer/HeaderCellComponent';
import { ICellComponentProps, IColumnConfig } from 'Controls/_grid/dirtyRender/cell/interface';
import {
    IBeforeContentRenderProps,
    IRowComponentProps,
} from 'Controls/_grid/gridReact/row/interface';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import { getFooterCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Footer';
import { getEditableTemplate } from 'Controls/_grid/gridReact/row/EditableTemplate';
import { getGroupCellComponentProps } from 'Controls/_grid/dirtyRender/group/utils/Group';
import { LadderWrapperRef } from 'Controls/_grid/gridReact/ladder/LadderWrapper';
import { default as DefaultCellComponent } from 'Controls/_grid/dirtyRender/cell/CellComponent';
import { groupConstants } from 'Controls/display';
import GroupCellComponent from 'Controls/_grid/dirtyRender/group/GroupCellComponent';
import { getEmptyCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/EmptyCell';
import { isGroupCell, isSpaceCell } from 'Controls/_grid/compatibleLayer/utils/Type';
import getDirtyDataCellComponentContentRender from 'Controls/_grid/utils/getDirtyDataCellComponentContentRender';
import { CompatibleGridCellComponent } from 'Controls/_grid/compatibleLayer/CellComponent';

export function getCompatibleCellComponent(
    cell: GridCell,
    cellProps: ICellComponentProps,
    baseRowProps: IRowComponentProps,
    multiSelectTemplate: React.ReactElement,
    beforeContentRender?: React.FunctionComponent<IBeforeContentRenderProps>
): React.ReactElement | null | undefined {
    const rowProps = { ...baseRowProps };
    delete rowProps['data-qa'];
    delete rowProps.attrs;

    const cellConfig = cell.config as unknown as IColumnConfig;
    let FunctionalCellComponent = rowProps._$FunctionalCellComponent || DefaultCellComponent;

    if (cell['[Controls/_display/grid/GroupCell]']) {
        FunctionalCellComponent = GroupCellComponent;
    }

    if (cell['[Controls/_display/grid/HeaderCell]']) {
        if (cellConfig?.template || cellConfig?.templateOptions?.contentTemplate) {
            const cellRenderComponent = cellConfig.template || CompatibleHeaderCellComponent;

            const render = templateLoader(cellRenderComponent, {
                column: cell,
                gridColumn: cell,
                ...rowProps,
                ...cellProps,
                className: cellProps.className || '',
                ...cellConfig.templateOptions,
                item: cell.getOwner(),
                key: cell.key,
            });

            return render;
        }

        return;
    }

    if (cell['[Controls/_display/grid/FooterCell]']) {
        if (cellConfig?.template) {
            const templateOptions = cellConfig?.templateOptions ?? {};

            const render = templateLoader(cellConfig.template, {
                column: cell,
                gridColumn: cell,
                ...rowProps,
                ...cellProps,
                className: '',
                ...templateOptions,
                item: cell.getOwner(),
                key: cell.key,
            });

            const footerCellProps = getFooterCellComponentProps({
                cell: cell as unknown as GridFooterCell,
                row: cell.getOwner() as unknown as GridFooterRow,
            });

            if (beforeContentRender) {
                const BeforeContentRender = beforeContentRender;
                footerCellProps.beforeContentRender = <BeforeContentRender cell={cell} />;
            }

            return (
                <FunctionalCellComponent
                    {...footerCellProps}
                    key={cell.key}
                    contentRender={render}
                />
            );
        }

        return;
    }

    if (cell['[Controls/_display/grid/EmptyCell]']) {
        const templateOptions = cellConfig?.templateOptions ?? {};

        const render = templateLoader(cell.getTemplate(), {
            ...rowProps,
            ...cellProps,
            ...templateOptions,
            item: cell.getOwner(),
            emptyViewColumn: cell,
            key: cell.key,
            column: cell,
            gridColumn: cell,
        });

        return (
            <FunctionalCellComponent
                {...rowProps}
                {...cellProps}
                {...getEmptyCellComponentProps({
                    row: cell.getOwner() as GridEmptyRow,
                    cell: cell as unknown as GridEmptyCell,
                })}
                className={cellProps.className || ''}
                column={cell}
                gridColumn={cell}
                key={cell.key}
                contentRender={render}
            />
        );
    }

    if (cell['[Controls/_display/grid/ResultsCell]']) {
        // cell.getOwner().getRowTemplate() - проверка для поддержки gridProps.resultsTemplate
        if (cellConfig?.resultTemplate || cell.getOwner().getRowTemplate()) {
            return templateLoader(cell.getTemplate(), {
                column: cell,
                key: cell.key,
                ...(cellConfig?.resultTemplateOptions || {}),
            });
        }

        return;
    }

    if (cell['[Controls/_display/grid/GroupCell]']) {
        if ((cell.contents as unknown as string) === groupConstants.hiddenGroup) {
            return;
        }
        // В ** contentRender ** группы лежит переданный прикладником View.props.groupRender
        // Он там появляется при резолве RowComponent на уровне самого View.
        if (rowProps.contentRender && rowProps.groupTemplate) {
            Logger.warn(
                'В список переданы одновременно опции groupTemplate и groupRender.' +
                    ' Опция groupTemplate будет проигнорирована.'
            );
            return;
        }
        if (rowProps.groupTemplate) {
            return templateLoader(rowProps.groupTemplate, {
                gridColumn: cell,
                column: cell,
                itemData: cell,
                colData: cell,
                ...cellProps,
                ...getGroupCellComponentProps({ cell, row: cell.getOwner(), rowProps }),
                item: cell.getOwner(),
                key: cell.key,
            }) as unknown as React.ReactElement;
        }
        // Группу можно рендерить только через GroupCellComponent,
        // поэтому во избежание рендера через cellConfig.template возвращаем undefined.
        return;
    }

    // В ячейке могут передать template=null
    // и это легальный в wasaby способ не рендерить прикладной шаблон
    const isValidForCellTemplate = !isGroupCell(cell) && !isSpaceCell(cell);
    if (cellConfig?.template && isValidForCellTemplate) {
        const templateOptions = cellConfig?.templateOptions ?? {};

        // Ladder compatibility.
        // Need ladderWrapper in StickyLadderCell, hidden cells, content ladder cell.
        // Не надо проверять на то, что текущая ячейка в ladder, т.к.
        // лесенка по какому-либо полю не обязательно совпадает с полем столбца.
        // см Controls-demo/explorerNew/SearchWithLadderPhoto/Index (автотест).
        if (cell.ladder) {
            templateOptions.ladderWrapper = LadderWrapperRef;
        }

        const className =
            (cellProps.className ? `${cellProps.className} ` : '') +
            (templateOptions.className ? templateOptions.className : '');

        const render = templateLoader(cellConfig?.template, {
            column: cell,
            gridColumn: cell,
            ...rowProps,
            ...cellProps,
            ...templateOptions,
            className,
            actionHandlers: rowProps.actionHandlers,
            item: cell.getOwner(),
            itemData: cell,
            key: cell.key,
            multiSelectTemplate,
        });

        if (cell.isEditable() && cellConfig?.editorTemplate) {
            const editorContentRender = getEditableTemplate(cell, cellProps, render);
            return (
                <FunctionalCellComponent
                    {...rowProps}
                    {...cellProps}
                    className={cellProps.className || ''}
                    column={cell}
                    gridColumn={cell}
                    key={cell.key}
                    render={editorContentRender}
                />
            );
        }

        return render;
    }

    if (cell.isEditable() && cellConfig?.editorTemplate && !cellConfig?.template) {
        const render = getDirtyDataCellComponentContentRender(cell, cellProps);
        const editorContentRender = getEditableTemplate(cell, cellProps, render);
        return (
            <FunctionalCellComponent
                {...rowProps}
                {...cellProps}
                className={cellProps.className || ''}
                column={cell}
                gridColumn={cell}
                key={cell.key}
                render={editorContentRender}
            />
        );
    }

    if (
        cell['[Controls/_display/grid/DataCell]'] &&
        cellConfig?.reactContentTemplate !== undefined
    ) {
        // reactContentTemplate - вариант sem-compatible.
        // Мы его должны отрендерить прямо тут.
        const contentRender = templateLoader(cellConfig.reactContentTemplate, {
            item: cell.getOwner(),
            column: cell,
            ladderWrapper: LadderWrapperRef,
            expanderTemplate: baseRowProps.expanderTemplate,
        });

        const render =
            cell.isEditable() && cellConfig?.editorTemplate
                ? getEditableTemplate(cell, cellProps, contentRender)
                : contentRender;

        return (
            <FunctionalCellComponent
                {...rowProps}
                {...cellProps}
                className={cellProps.className || ''}
                column={cell}
                gridColumn={cell}
                key={cell.key}
                render={render}
            />
        );
    }

    // Compatible-рендер для случая, когда шаблон контента задан через columns[...].templateOptions.contentTemplate
    // https://online.sbis.ru/opendoc.html?guid=4e87d600-2d51-4724-bead-bbd8f49bf925
    if (cellConfig?.templateOptions?.contentTemplate !== undefined) {
        const render =
            cell.isEditable() && cellConfig?.editorTemplate
                ? getEditableTemplate(cell, cellProps, cellConfig?.templateOptions?.contentTemplate)
                : cellConfig?.templateOptions?.contentTemplate;

        return (
            <CompatibleGridCellComponent
                column={cell}
                gridColumn={cell}
                {...rowProps}
                {...cellProps}
                {...cellConfig.templateOptions}
                className={cellProps.className || ''}
                actionHandlers={rowProps.actionHandlers}
                item={cell.getOwner()}
                itemData={cell}
                key={cell.key}
                multiSelectTemplate={multiSelectTemplate}
                contentRender={render}
            />
        );
    }
}
