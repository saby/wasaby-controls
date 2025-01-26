/*
 * Метод возвращает переданный прикладником, и
 * обёрнутый у нас в слой совместимости CellComponent.
 * Компонент будет вставлен непосредственно в RowComponent при помощи cellIterator.
 */
import * as React from 'react';
import type {
    GridCell,
    GridFooterCell,
    GridFooterRow,
    GridEmptyRow,
    GridEmptyCell,
} from 'Controls/gridDisplay';
import { CompatibleHeaderCellComponent } from 'Controls/_gridRender/cL/cell/Header';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { IColumnConfig } from 'Controls/_gridRender/cell/interface/IColumnConfig';
import {
    IBeforeContentRenderProps,
    IRowComponentProps,
} from 'Controls/_gridRender/row/interface/IRowComponent';
import { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
import { getFooterCellProps } from 'Controls/_gridRender/cell/utils/Footer';
import { getEditableTemplate } from 'Controls/_gridRender/row/utils/Resolvers/Editor';
import { getGroupCellProps } from 'Controls/_gridRender/cell/utils/Group';
import { LadderWrapperRef } from 'Controls/_gridRender/ladder/Wrapper';
import { default as DefaultCellComponent } from 'Controls/_gridRender/cell/Data';
import { groupConstants } from 'Controls/display';
import GroupCellComponent from 'Controls/_gridRender/cell/Group';
import { getEmptyCellProps } from 'Controls/_gridRender/cell/utils/Empty';
import EmptyCellComponent from 'Controls/_gridRender/cell/Empty';
import { isGroupCell, isSpaceCell } from 'Controls/_gridRender/utils/Type';
import contentRenderResolver from 'Controls/_gridRender/cell/dirty/ContentRenderResolver';
import { CompatibleGridCellComponent } from 'Controls/_gridRender/cL/cell/Data';
import { getDataCellProps } from 'Controls/_gridRender/cell/utils/Data';
import { initValidator } from 'Controls/_gridRender/utils/compatibleValidator';
import { executeSyncOrAsync } from 'UICommon/Deps';

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
    let FunctionalCellComponent = rowProps._$FCC || DefaultCellComponent;

    // Есть кейсы, когда шаблон с RowComponent рендерят вне списка.
    // Тогда _$checkTemplateValidator будет undefined, поэтому необходимо передавать пустую функцию
    const checkValidator = baseRowProps._$checkTemplateValidator ?? (() => {});

    if (cell.$GSC) {
        return;
    }

    if (cell.$GGC) {
        FunctionalCellComponent = GroupCellComponent;
    }

    if (cell.$GHC) {
        if (cellConfig?.template || cellConfig?.templateOptions?.contentTemplate) {
            const cellRenderComponent = cellConfig.template || CompatibleHeaderCellComponent;

            const compatibleCallValidator = initValidator();
            const render = templateLoader(cellRenderComponent, {
                column: cell,
                gridColumn: cell,
                ...rowProps,
                ...cellProps,
                className: cellProps.className || '',
                ...cellConfig.templateOptions,
                item: cell.getOwner(),
                key: cell.key,
                _$compatibleCallValidator: compatibleCallValidator,
                _$expectedTemplate: 'HeaderContent',
            });
            checkValidator(compatibleCallValidator, 'HeaderContent', cell?.columnIndex);
            return render;
        }

        return;
    }

    if (cell.$GFC) {
        if (cellConfig?.template) {
            const templateOptions = cellConfig?.templateOptions ?? {};

            const compatibleCallValidator = initValidator();
            const expectedTemplate = templateOptions._$isFooterTemplate
                ? 'FooterTemplate'
                : 'FooterColumnTemplate';

            const render = templateLoader(cellConfig.template, {
                column: cell,
                gridColumn: cell,
                ...rowProps,
                ...cellProps,
                className: '',
                ...templateOptions,
                item: cell.getOwner(),
                key: cell.key,
                _$compatibleCallValidator: compatibleCallValidator,
                _$expectedTemplate: expectedTemplate,
            });
            checkValidator(compatibleCallValidator, expectedTemplate, cell?.columnIndex);
            const footerCellProps = getFooterCellProps({
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

    // Рендерим прикладной шаблон пустого
    if (cell.$GEC) {
        if (!cell.getTemplate()) {
            return;
        }
        const templateOptions = cellConfig?.templateOptions ?? {};
        const expectedTemplate = templateOptions._$isEmptyTemplate
            ? 'EmptyTemplate'
            : 'EmptyColumnTemplate';

        const compatibleCallValidator = initValidator();

        // Загрузит contentRender для пустого представления.
        const contentRender = templateLoader(cell.getTemplate(), {
            ...rowProps,
            ...cellProps,
            ...templateOptions,
            item: cell.getOwner(),
            emptyViewColumn: cell,
            key: cell.key,
            column: cell,
            gridColumn: cell,
            _$compatibleCallValidator: compatibleCallValidator,
            _$expectedTemplate: expectedTemplate,
        });

        checkValidator(compatibleCallValidator, expectedTemplate, cell?.columnIndex);

        // Отобразит его внутри нашего чистого EmptyCellComponent
        return (
            <EmptyCellComponent
                {...getEmptyCellProps({
                    row: cell.getOwner() as GridEmptyRow,
                    cell: cell as unknown as GridEmptyCell,
                    rowProps,
                })}
                className={cellProps.className || ''}
                key={cell.key}
                contentRender={contentRender}
            />
        );
    }

    if (cell.$GRC) {
        // cell.getOwner().getRowTemplate() - проверка для поддержки gridProps.resultsTemplate
        if (cellConfig?.resultTemplate || cell.getOwner().getRowTemplate()) {
            const compatibleCallValidator = initValidator();
            const expectedTemplate = cellConfig?.resultTemplate
                ? 'ResultColumnTemplate'
                : 'ResultsTemplate';

            const render = templateLoader(cell.getTemplate(), {
                column: cell,
                key: cell.key,
                ...(cellConfig?.resultTemplateOptions || {}),
                _$compatibleCallValidator: compatibleCallValidator,
                _$expectedTemplate: expectedTemplate,
            });
            checkValidator(compatibleCallValidator, expectedTemplate, cell?.columnIndex);
            return render;
        }

        return;
    }

    if (cell.$GGC) {
        if ((cell.contents as unknown as string) === groupConstants.hiddenGroup) {
            return;
        }
        // В ** contentRender ** группы лежит переданный прикладником View.props.groupRender
        // Он там появляется при резолве RowComponent на уровне самого View.
        if (rowProps.contentRender && rowProps.groupTemplate) {
            executeSyncOrAsync(['Controls/listErrors'], (errs) =>
                errs.GroupTemplateAndGroupRenderError()
            );
            return;
        }
        if (rowProps.groupTemplate) {
            const compatibleCallValidator = initValidator();
            const render = templateLoader(rowProps.groupTemplate, {
                gridColumn: cell,
                column: cell,
                itemData: cell,
                colData: cell,
                ...cellProps,
                // todo повторное вычисление внутри GroupTemplate. Это точно тут надо ?
                ...getGroupCellProps({ cell, row: cell.getOwner(), rowProps }),
                item: cell.getOwner(),
                key: cell.key,
                _$compatibleCallValidator: compatibleCallValidator,
                _$expectedTemplate: 'GroupTemplate',
            }) as unknown as React.ReactElement;
            checkValidator(compatibleCallValidator, 'GroupTemplate');
            return render;
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

        const compatibleCallValidator = initValidator();
        const expectedTemplate = templateOptions._$isItemEditorTemplate
            ? 'ItemEditorTemplate'
            : 'ColumnTemplate';
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
            _$compatibleCallValidator: compatibleCallValidator,
            _$expectedTemplate: expectedTemplate,
        });
        checkValidator(compatibleCallValidator, expectedTemplate, cell?.columnIndex);

        // TODO Код дублируется ниже, вроде можно оптимизировать.
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
        const render = contentRenderResolver(cell, cellProps);
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

    if (cell.$GDC && cellConfig?.reactContentTemplate !== undefined) {
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
                {...getDataCellProps({
                    cellComponentProps: cellProps,
                    cell,
                    row: cell.getOwner(),
                    decorationStyle: rowProps.decorationStyle,
                })}
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
                {...getDataCellProps({
                    cellComponentProps: cellProps,
                    cell,
                    row: cell.getOwner(),
                    decorationStyle: rowProps.decorationStyle,
                })}
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
