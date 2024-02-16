import { default as MarkupElement } from './MarkupElement';
import { BoundingRectContext, IControlDesignerProps } from 'FrameEditor/player';
import { TColumnsForCtor, THeaderForCtor, IColumn } from 'Controls/grid';
import * as React from 'react';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import { IBoundingRectContext } from 'FrameEditor/_player/editing/EditingContext';
import { StackOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import {
    getInitialColumnConfig,
    onItemClickForReplace,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import {
    COLUMN_INDEX_OFFSET,
    ADD_ON_RIGHT_MODE,
    ADD_ON_LEFT_MODE,
} from 'Controls-Lists-editors/_columnsEditor/constants';

interface IOnItemClickHandler {
    allColumns: TColumnsForCtor;
    columns: TColumnsForCtor;
    header: THeaderForCtor;
    onChange: Function;
    value: object;
    onClose: Function;
    neighbourIdx: number;
    mode: 'right' | 'left';
    item: Model;
}

interface IGridTemplate {
    gridTemplateColumns: string;
    gridTemplateRows: string;
}
interface IGetGridColumnsWidth {
    boundingRectContext: IBoundingRectContext;
    widgetHTMLElement?: HTMLElement;
}
interface IMarkup {
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
    gridColumnsWidth: number[];
    /**
     * Высота колонок в разметке
     */
    gridRowsHeight: string[];
    /**
     * Колбэк добавления колонки
     */
    onAddButtonClick: Function;
    /**
     * Колбэк удаления колонки
     */
    onDeleteButtonClick: Function;
    /**
     * Колбэк замены колонки
     */
    onReplaceColumnClick: Function;
    /**
     * Колбэк редактирования колонки
     */
    onEdit: Function;
    getColumnValue?: Function;
}

// TODO Утилита
function calculateGridTemplate(
    columns: TColumnsForCtor,
    gridRowsHeight: string[],
    gridColumnsWidth: number[] = []
): IGridTemplate {
    let gridTemplateColumns = '';
    let gridTemplateRows = '';
    columns.map((column, columnId) => {
        if (column?.width) {
            const width =
                gridColumnsWidth[columnId] !== 0 ? `${gridColumnsWidth[columnId]}px` : column.width;
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

// TODO Утилита
function onColumnEditCallback(
    onChange: Function,
    value: object,
    columns: TColumnsForCtor,
    header: THeaderForCtor,
    idx: number,
    newColumnProperties: object = {},
    newHeaderProperties: object = {}
) {
    const rightColumnIdx = idx + 1;
    const leftColumnIdx = idx - 1;
    const newColumns = [...columns];
    const newHeader = [...header];
    newColumns[idx] = { ...columns[idx], ...newColumnProperties };
    // Если у колонки были отредактированы границы, то необходимо также изменить границы смежных колонок
    if (rightColumnIdx < newColumns.length) {
        newColumns[rightColumnIdx] = {
            ...columns[rightColumnIdx],
            columnSeparatorSize: {
                ...newColumns[rightColumnIdx].columnSeparatorSize,
                left: newColumns[idx].columnSeparatorSize?.right || 's',
            },
        };
    }
    if (leftColumnIdx >= 0) {
        newColumns[leftColumnIdx] = {
            ...columns[leftColumnIdx],
            columnSeparatorSize: {
                ...newColumns[leftColumnIdx].columnSeparatorSize,
                right: newColumns[idx].columnSeparatorSize?.left || 's',
            },
        };
    }
    newHeader[idx] = { ...header[idx], ...newHeaderProperties };
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
}

// TODO Утилита
function onOpenColumnsList(
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor,
    header: THeaderForCtor,
    columns: TColumnsForCtor,
    dialog: StackOpener,
    onItemClick: Function,
    onItemClickParams?: object
) {
    if (!dialog.isOpened()) {
        dialog.open({
            restrictiveContainer: '.columnValueListRestrictiveContainer',
            template: 'Controls-Lists-editors/columnsEditor:ColumnsListPopupRender',
            templateOptions: {
                allColumns,
                allHeader,
                header,
                columns,
                onItemClick,
                onClose: () => {
                    return dialog.close();
                },
                onItemClickParams,
            },
        });
    }
}

// TODO Утилита
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

// TODO Утилита
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

// TODO Утилита
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
// TODO Утилита
/**
 * Обработчик добавления колонки по клику на элемент списка
 * @param params {IOnItemClickHandler}
 */
export function onItemClickForAdd(params: IOnItemClickHandler) {
    const { item, allColumns, columns, header, value, onChange, onClose, mode, neighbourIdx } =
        params;
    const offset =
        mode === ADD_ON_RIGHT_MODE ? COLUMN_INDEX_OFFSET.right : COLUMN_INDEX_OFFSET.left;
    const columnToAdd = {
        ...allColumns[item.getRawData().startColumn - 1],
    };
    columnToAdd.columnSeparatorSize = {
        ...allColumns[item.getRawData().startColumn - 1].columnSeparatorSize,
    };
    columnToAdd.columnSeparatorSize[
        mode === ADD_ON_RIGHT_MODE ? ADD_ON_LEFT_MODE : ADD_ON_RIGHT_MODE
    ] = columns[neighbourIdx].columnSeparatorSize?.[mode] || 's';
    if (
        (mode === ADD_ON_RIGHT_MODE && neighbourIdx + 1 < columns.length) ||
        (mode === ADD_ON_LEFT_MODE && neighbourIdx - 1 >= 0)
    ) {
        const modeNeighbourIndex = mode === ADD_ON_RIGHT_MODE ? neighbourIdx + 1 : neighbourIdx - 1;
        columns[modeNeighbourIndex].columnSeparatorSize = {
            ...columns[modeNeighbourIndex].columnSeparatorSize,
        };
        columns[modeNeighbourIndex].columnSeparatorSize[
            mode === ADD_ON_RIGHT_MODE ? ADD_ON_LEFT_MODE : ADD_ON_RIGHT_MODE
        ] = columnToAdd.columnSeparatorSize?.[mode] || 's';
    }
    const headerToAdd = {
        ...item.getRawData(),
        startColumn: header[neighbourIdx].startColumn + offset,
        endColumn: header[neighbourIdx].endColumn + offset,
    };
    const newColumns = [...columns];
    const columnIdx = headerToAdd.startColumn - 1;
    newColumns.splice(columnIdx, 0, columnToAdd);
    const newHeader = [...header];
    recalculateColumnsHeader(
        newHeader,
        neighbourIdx + offset,
        headerToAdd.startColumn - headerToAdd.endColumn
    );
    newHeader.splice(neighbourIdx + offset, 0, headerToAdd);
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
    onClose();
}

/**
 * Рассчитать разметку
 * @param params {IMarkup}
 */
function Markup(params: IMarkup) {
    const {
        headers,
        onAddButtonClick,
        onDeleteButtonClick,
        columns,
        onEdit,
        gridColumnsWidth,
        gridRowsHeight,
        getColumnValue,
        onReplaceColumnClick,
    } = params;
    const markupContent = [];
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const columnStyle = {
            gridColumn: `${header?.startColumn}/${header?.endColumn}`,
            gridRow: `${header?.startRow}/${header?.endRow}`,
        };
        const highlightContainerStyle = {
            height: '100%',
        };
        const markupValue = {
            caption: header.caption,
            width: columns[header.startColumn - 1].width,
            textOverflow: header.textOverflow,
            align: header.align,
            columnValue: {
                caption: getColumnValue(columns[header.startColumn - 1]).caption,
                displayProperty: columns[header.startColumn - 1].displayProperty,
            },
            columnSeparatorSize: columns[header.startColumn - 1].columnSeparatorSize,
        };
        markupContent.push(
            <MarkupElement
                key={i}
                id={i}
                style={columnStyle}
                highlightContainerStyle={highlightContainerStyle}
                onDeleteButtonClick={i !== 0 ? onDeleteButtonClick : undefined}
                onAddButtonClick={onAddButtonClick}
                onEdit={onEdit}
                markupValue={markupValue}
                onReplaceColumnClick={onReplaceColumnClick}
            />
        );
    }
    const markupStyle = calculateGridTemplate(columns, gridRowsHeight, gridColumnsWidth);
    return { content: markupContent, style: markupStyle };
}

// TODO Утилита
/**
 * Получить актуальные ширины колонок в grid:View
 * @param props
 */
function getGridColumnsWidth(props: IGetGridColumnsWidth): number[] | undefined {
    const { boundingRectContext, widgetHTMLElement } = props;
    const headersHTML = widgetHTMLElement?.getElementsByClassName('controls-Grid__header-cell');
    if (headersHTML) {
        const newGridRowsWidth: number[] = [];
        for (let i = 0; i < headersHTML?.length; i++) {
            const headerHTML = boundingRectContext.getElementBoundingRect(headersHTML[i]);
            newGridRowsWidth[i] = headerHTML.width;
        }
        return newGridRowsWidth;
    }
    return undefined;
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
    const [gridColumnsWidth, setGridColumnsWidth] = React.useState<number[]>([]);
    const boundingRectContext = React.useContext(BoundingRectContext);
    const widgetHTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const headerHTMLElement = widgetHTMLElement?.querySelector('.controls-Grid__header');
    // Здесь необходимо использование MutationObserver, чтобы отслеживать изменения DOM-элемента заголовка таблицы
    // и запускать при этом пересчет ширин колонок для разметки.
    // Если этого не сделать, то при добавлении новой колонки сначала пересчитается разметка, а потом перестроится grid:View
    // А значит разметка отобразится на неверных данных
    const mutationObserver = React.useMemo(() => {
        return new MutationObserver(() => {
            const actualGridColumnsWidth = getGridColumnsWidth({
                boundingRectContext,
                widgetHTMLElement,
            });
            if (actualGridColumnsWidth) {
                setGridColumnsWidth(actualGridColumnsWidth);
            }
        });
    }, []);
    React.useEffect(() => {
        mutationObserver.disconnect();
        if (headerHTMLElement) {
            mutationObserver.observe(headerHTMLElement, { childList: true });
        }
    }, [headerHTMLElement, mutationObserver]);
    React.useEffect(() => {
        const actualGridColumnsWidth = getGridColumnsWidth({
            boundingRectContext,
            widgetHTMLElement,
        });
        if (actualGridColumnsWidth) {
            setGridColumnsWidth(actualGridColumnsWidth);
        }
    }, [boundingRectContext, widgetHTMLElement]);
    const addColumnDialogOpener = new StackOpener();
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
        [onChange, value, columns, headers]
    );
    const onAddButtonClick = React.useCallback(
        (neighbourIdx: number, mode: 'left' | 'right') => {
            const onItemClickParams = {
                onChange,
                value,
                neighbourIdx,
                mode,
            };
            return onOpenColumnsList(
                allColumns,
                allHeader,
                headers,
                columns,
                addColumnDialogOpener,
                onItemClickForAdd,
                onItemClickParams
            );
        },
        [allColumns, headers, columns, onChange]
    );
    const onReplaceColumnClick = React.useCallback(
        (onValueChange: Function) => {
            const onItemClickParams = {
                onValueChange,
            };
            return onOpenColumnsList(
                allColumns,
                allHeader,
                headers,
                columns,
                addColumnDialogOpener,
                onItemClickForReplace,
                onItemClickParams
            );
        },
        [allColumns, headers, columns, onChange]
    );
    const onDeleteButtonClick = React.useCallback(
        (idx: number) => {
            return onColumnDeleteCallback(headers, columns, idx, onChange, value);
        },
        [headers, columns, onChange, value]
    );
    const getColumnValue = React.useCallback(
        (column: IColumn) => {
            return getInitialColumnConfig(column, allColumns, allHeader);
        },
        [allColumns, allHeader]
    );

    const markupContent = React.useMemo(() => {
        return Markup({
            headers,
            gridColumnsWidth,
            onAddButtonClick,
            onDeleteButtonClick,
            columns,
            onEdit,
            gridRowsHeight,
            getColumnValue,
            onReplaceColumnClick,
        });
    }, [boundingRectContext, gridColumnsWidth, getColumnValue]);

    return (
        <div
            style={markupContent.style}
            className={'ControlsListsEditors_columnsDesignTime-markup_container '}
        >
            {markupContent.content}
        </div>
    );
}
