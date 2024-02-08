import { default as MarkupElement } from './MarkupElement';
import { BoundingRectContext, IControlDesignerProps, IBoundingRectContext } from 'FrameEditor/player';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import * as React from 'react';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import { DialogOpener } from 'Controls/popup';

interface IGridTemplate {
    gridTemplateColumns: string;
    gridTemplateRows: string;
}
interface IMarkup {
    /**
     * Контекст
     */
    boundingRectContext: IBoundingRectContext;
    /**
     * Отображаемые заголовки
     */
    headers: THeaderForCtor;
    /**
     * Отображаемые колонки
     */
    columns: TColumnsForCtor;
    /**
     * Ширина колонок gridView
     */
    gridRowsWidth: number[];
    /**
     * Высота колонок в разметке
     */
    gridRowsHeight: string[];
    /**
     * Колбэк добавления колонки
     */
    onAdd: Function;
    /**
     * Колбэк удаления колонки
     */
    onDelete: Function;
    /**
     * Колбэк редактирования колонки
     */
    onEdit: Function;
}
function calculateGridTemplate(
    columns: TColumnsForCtor,
    gridRowsHeight: string[],
    gridRowsWidth: number[] = []
): IGridTemplate {
    let gridTemplateColumns = '';
    let gridTemplateRows = '';
    columns.map((column, columnId) => {
        if (column?.width) {
            const width =
                gridRowsWidth[columnId] !== 0 ? `${gridRowsWidth[columnId]}px` : column.width;
            gridTemplateColumns += width + ' ';
        }
    });
    gridRowsHeight.map((rowHeight: string | undefined) => {
        if (rowHeight) {
            gridTemplateRows += rowHeight + ' ';
        }
    });
    return {
        gridTemplateColumns,
        gridTemplateRows: `${gridTemplateRows} 1fr`,
    };
}

function onColumnEditCallback(
    onChange: Function,
    value: object,
    columns: TColumnsForCtor,
    header: THeaderForCtor,
    idx: number,
    newColumnProperties: object = {},
    newHeaderProperties: object = {}
) {
    const newColumns = [...columns];
    const newHeader = [...header];
    newColumns[idx] = { ...columns[idx], ...newColumnProperties };
    newHeader[idx] = { ...header[idx], ...newHeaderProperties };
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
}

function onColumnAddCallback(
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor,
    onChange: Function,
    value: object,
    header: THeaderForCtor,
    columns: TColumnsForCtor,
    neighbourIdx: number,
    mode: 'right' | 'left',
    dialog: DialogOpener
) {
    if (!dialog.isOpened()) {
        dialog.open({
            template: 'Controls-Lists-editors/columnsEditor:ColumnsListPopupRender',
            templateOptions: {
                allColumns,
                allHeader,
                header,
                columns,
                onChange,
                value,
                onClose: () => {
                    return dialog.close();
                },
                neighbourIdx,
                mode,
            },
        });
    }
}

/**
 * Пересчитать колонки/ряды, занимаемые заголовками
 * @param header
 * @param headerIdx
 * @param offset
 */
export function recalculateColumnsHeader(
    header: THeaderForCtor,
    headerIdx: number,
    offset: number
) {
    for (let i = headerIdx; i < header.length; i++) {
        header[i] = { ...header[i], startColumn: header[i].startColumn - offset };
        header[i] = { ...header[i], endColumn: header[i].endColumn - offset };
    }
}

export function notifyContextValueChanged(
    onChange: Function,
    value: object,
    newStaticProperties: object
) {
    const newValue = value.modify({
        staticProperties: newStaticProperties,
    });
    onChange(newValue);
}

function onColumnDeleteCallback(
    headers: THeaderForCtor,
    columns: TColumnsForCtor,
    headerIdx: number,
    onChange: Function,
    value: object
) {
    const headerToDelete = headers[headerIdx];
    const columnOffset = headerToDelete.endColumn - headerToDelete.startColumn;
    const newColumns = [...columns];
    newColumns.splice(headerToDelete.startColumn - 1, columnOffset);
    const newHeader = [...headers];
    newHeader.splice(headerIdx, columnOffset);
    recalculateColumnsHeader(newHeader, headerIdx, columnOffset);
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
}

/**
 * Рассчитать разметку
 * @param params {IMarkup}
 */
function Markup(params: IMarkup) {
    const {
        boundingRectContext,
        headers,
        onAdd,
        onDelete,
        columns,
        onEdit,
        gridRowsWidth,
        gridRowsHeight,
    } = params;
    const markupContent = [];
    const widgetHTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const gridHTMLElement = widgetHTMLElement?.getElementsByClassName('controls-Grid_default')[0];
    const gridHeight = boundingRectContext.getElementBoundingRect(gridHTMLElement).height;
    const headersHTML = widgetHTMLElement?.getElementsByClassName('controls-Grid__header-cell');
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const columnSpan =
            header?.startColumn && header?.endColumn ? header.endColumn - header.startColumn : 1;
        const isMultiHeader = columnSpan > 1;
        const headerTopOffset = 0;
        const headerHTML = boundingRectContext.getElementBoundingRect(headersHTML[i]);
        gridRowsWidth[i] = headerHTML.width;
        const columnStyle = {
            gridColumn: `${header?.startColumn}/${header?.endColumn}`,
            gridRow: `${header?.startRow}/${header?.endRow}`,
        };
        const highlightContainerStyle = {
            height: isMultiHeader ? `${gridHeight - headerTopOffset}px` : '100%',
        };
        const markupValue = {
            caption: header.caption,
            width: columns[header.startColumn - 1].width,
        };
        markupContent.push(
            <MarkupElement
                key={i}
                id={i}
                style={columnStyle}
                highlightContainerStyle={highlightContainerStyle}
                onDelete={!isMultiHeader && i !== 0 ? onDelete : undefined}
                onAdd={!isMultiHeader ? onAdd : undefined}
                onEdit={onEdit}
                markupValue={markupValue}
            />
        );
    }
    const markupStyle = calculateGridTemplate(columns, gridRowsHeight, gridRowsWidth);
    return { content: markupContent, style: markupStyle };
}

export default function ColumnsDesignTimeEditor(props: IControlDesignerProps) {
    const staticProperties = props.value.getStaticProperties();
    const columns: TColumnsForCtor = staticProperties.selectedColumns;
    const headers: THeaderForCtor = staticProperties.selectedHeaders;
    const allColumns: TColumnsForCtor = staticProperties.allColumns;
    const allHeader: THeaderForCtor = staticProperties.allHeader;
    const { onChange, value } = props;
    const gridRowsHeight: string[] = React.useMemo(() => {
        return [];
    }, []);
    const gridRowsWidth: number[] = React.useMemo(() => {
        return [];
    }, []);
    const boundingRectContext = React.useContext(BoundingRectContext);
    const addColumnDialogOpener = new DialogOpener();
    const onEdit = React.useCallback(
        (columnIdx: number) => {
            return (newColumnProperties: object = {}, newHeaderProperties: object = {}) => {
                return onColumnEditCallback(
                    onChange,
                    value,
                    columns,
                    headers,
                    columnIdx,
                    newColumnProperties,
                    newHeaderProperties
                );
            };
        },
        [onChange, value, columns]
    );
    const onAdd = React.useCallback(
        (idx: number, mode: 'left' | 'right') => {
            return onColumnAddCallback(
                allColumns,
                allHeader,
                onChange,
                value,
                headers,
                columns,
                idx,
                mode,
                addColumnDialogOpener
            );
        },
        [allColumns, headers, columns, onChange]
    );
    const onDelete = React.useCallback(
        (idx: number) => {
            return onColumnDeleteCallback(headers, columns, idx, onChange, value);
        },
        [headers, columns, onChange, value]
    );
    const markupContent = React.useMemo(() => {
        return Markup({
            boundingRectContext,
            headers,
            gridRowsWidth,
            onAdd,
            onDelete,
            columns,
            onEdit,
            gridRowsHeight,
        });
    }, [headers, columns, boundingRectContext, gridRowsWidth]);

    return (
        <div
            style={markupContent.style}
            className={'ControlsListsEditors_columnsDesignTime-markup_container '}
        >
            {markupContent.content}
        </div>
    );
}
