import { default as MarkupElement } from './MarkupElement';
import { BoundingRectContext, IControlDesignerProps } from 'FrameEditor/player';
import { TColumnsForCtor, THeaderForCtor, IColumn } from 'Controls/grid';
import * as React from 'react';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import { IBoundingRectContext } from 'FrameEditor/_player/editing/EditingContext';
import { StackOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import {
    COLUMN_INDEX_OFFSET,
    ADD_ON_RIGHT_MODE,
    ADD_ON_LEFT_MODE,
    INIT_SCROLL_LEFT,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { ColumnsEditorPopupContext } from 'Controls-Lists-editors/_columnsEditor/context/ColumnsEditorPopupContext';
import {
    moveScrollLeft,
    itemClickForReplace,
} from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { getInitialColumnConfig } from 'Controls-Lists-editors/_columnsEditor/utils/data';
import { Container, Entity, IDragObject } from 'Controls/dragnDrop';

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
interface IGetVisibleMarkupColumnsWidthParams {
    gridColumnsWidth: number[];
    scrollLeft: number | undefined;
    availableWidth: number;
}

interface IDragObjectItem {
    id: number;
    width: number;
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
     * Ширина колонок разметки
     */
    markupElementsWidth: number[];
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
    scrollLeft?: boolean;
    onMarkupElementMouseDown?: Function;
    onMarkupElementMouseMove?: Function;
    dragObjectId?: number;
}

// TODO Утилита (разметка)
export function calculateGridTemplate(
    columns: TColumnsForCtor,
    gridRowsHeight: string[],
    gridColumnsWidth: number[] = []
): IGridTemplate {
    let gridTemplateColumns = '';
    let gridTemplateRows = '';
    columns.map((column, columnId) => {
        if (column?.width) {
            const width =
                gridColumnsWidth[columnId] !== undefined
                    ? `${gridColumnsWidth[columnId]}px`
                    : column.width;
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

function onColumnsSwipeCallback(
    onChange: Function,
    value: object,
    columns: TColumnsForCtor,
    header: THeaderForCtor,
    firstColumnIdx: number,
    secondColumnIdx: number
) {
    const newColumns = [...columns];
    newColumns[secondColumnIdx] = { ...columns[firstColumnIdx] };
    newColumns[firstColumnIdx] = { ...columns[secondColumnIdx] };
    const newHeader = [...header];
    newHeader[firstColumnIdx] = {
        ...header[secondColumnIdx],
        startColumn: header[firstColumnIdx].startColumn,
        endColumn: header[firstColumnIdx].endColumn,
    };
    newHeader[secondColumnIdx] = {
        ...header[firstColumnIdx],
        startColumn: header[secondColumnIdx].startColumn,
        endColumn: header[secondColumnIdx].endColumn,
    };
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
}

// TODO Утилита (обработчики)
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

// TODO Утилита (обработчики)
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

// TODO Утилита (разметка)
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

// TODO Утилита (обработчик)
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
// TODO Утилита (обработчик)
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
        markupElementsWidth,
        gridRowsHeight,
        getColumnValue,
        onReplaceColumnClick,
        scrollLeft,
        onMarkupElementMouseDown,
        onMarkupElementMouseMove,
        dragObjectId,
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
        const currentColumn = header.startColumn - 1;
        const markupValue = {
            caption: header.caption,
            width: columns[currentColumn].width,
            textOverflow: header.textOverflow,
            align: header.align,
            columnValue: {
                caption: getColumnValue(columns[currentColumn]).caption,
                displayProperty: columns[currentColumn].displayProperty,
            },
            columnSeparatorSize: columns[currentColumn].columnSeparatorSize,
            cellPadding: columns[currentColumn].cellPadding,
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
                resizeLinePosition={
                    scrollLeft === undefined || i === headers.length - 1 ? 'left' : 'right'
                }
                isMainColumn={i === 0}
                onMouseDown={onMarkupElementMouseDown}
                onMouseMove={onMarkupElementMouseMove}
                dragObjectId={dragObjectId}
            />
        );
    }
    const markupStyle = calculateGridTemplate(columns, gridRowsHeight, markupElementsWidth);
    return { content: markupContent, style: markupStyle };
}

// TODO Утилита (разметка)
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

function calculateMarkupElementsWidth(params: IGetVisibleMarkupColumnsWidthParams): number[] {
    const { gridColumnsWidth, scrollLeft, availableWidth } = params;
    const visibleColumnsWidth = [...gridColumnsWidth];
    let currentScrollLeft = scrollLeft;
    let currentAvailableWidth = availableWidth;
    if (currentScrollLeft !== undefined) {
        for (let i = 0; i < visibleColumnsWidth.length; i++) {
            if (i !== 0) {
                if (visibleColumnsWidth[i] <= currentScrollLeft) {
                    currentScrollLeft -= visibleColumnsWidth[i];
                    visibleColumnsWidth[i] = 0;
                } else {
                    visibleColumnsWidth[i] -= currentScrollLeft;
                    currentScrollLeft = 0;
                }
            }
            if (currentAvailableWidth > 0) {
                if (currentAvailableWidth >= visibleColumnsWidth[i]) {
                    currentAvailableWidth -= visibleColumnsWidth[i];
                } else {
                    visibleColumnsWidth[i] = currentAvailableWidth;
                    currentAvailableWidth = 0;
                }
            } else {
                visibleColumnsWidth[i] = 0;
            }
        }
    }
    return visibleColumnsWidth;
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
    const [scrollLeft, setScrollLeft] = React.useState<number | undefined>(INIT_SCROLL_LEFT);
    const boundingRectContext = React.useContext(BoundingRectContext);
    const widgetHTMLElement: HTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const headerHTMLElement: HTMLElement =
        widgetHTMLElement?.querySelector('.controls-Grid__header');
    const popupContainer: HTMLElement =
        React.useContext(ColumnsEditorPopupContext).popupContainer?.current;
    const [dragObjectItem, setDragObjectItem] = React.useState<IDragObjectItem | undefined>(
        undefined
    );
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
    const onMouseMove = React.useCallback(
        (event) => {
            const thumb = widgetHTMLElement?.querySelector('.js-controls-ColumnScroll__thumb');
            if (thumb && !thumb.className.includes('ws-hidden')) {
                const nextScrollLeft = moveScrollLeft({
                    popupContainer,
                    prevScrollLeft: scrollLeft,
                    widgetHTMLElement,
                    buttons: event.buttons,
                    clientX: event.clientX,
                    clientY: event.clientY,
                });
                if (nextScrollLeft !== undefined) {
                    setScrollLeft(nextScrollLeft);
                }
            } else {
                setScrollLeft(undefined);
            }
        },
        [scrollLeft, dragObjectItem]
    );
    const prevMouseMove = React.useRef(undefined);
    const dndContainerRef = React.useRef<Container>(null);
    const onMarkupElementMouseDown = React.useCallback(
        (event, item) => {
            dndContainerRef.current?.startDragNDrop(new Entity({ ...item }), event);
        },
        [dndContainerRef]
    );
    const onDragStart = React.useCallback((newDragObject: IDragObject) => {
        const entity = newDragObject.entity;
        const item: IDragObjectItem = entity.getOptions?.();
        setDragObjectItem(item);
    }, []);
    const onDragEnd = React.useCallback(() => {
        setDragObjectItem(undefined);
    }, []);
    const onMarkupElementMouseMove = React.useCallback(
        (targetColumnIdx: number, offsetX: number, targetColumnWidth: number) => {
            if (dragObjectItem) {
                const dragObjectIdx = dragObjectItem.id;
                const dragObjectWidth = dragObjectItem.width;
                if (dragObjectIdx && targetColumnIdx && targetColumnIdx !== dragObjectIdx) {
                    const direction = targetColumnIdx - dragObjectIdx > 0 ? 'right' : 'left';
                    if (
                        (direction === 'right' && offsetX > targetColumnWidth - dragObjectWidth) ||
                        (direction === 'left' && offsetX < dragObjectWidth)
                    ) {
                        const updateDragObjectItem = { ...dragObjectItem };
                        updateDragObjectItem.id = targetColumnIdx;
                        setDragObjectItem(updateDragObjectItem);
                        onColumnsSwipeCallback(
                            onChange,
                            value,
                            columns,
                            headers,
                            dragObjectIdx,
                            targetColumnIdx
                        );
                    }
                }
            }
        },
        [dragObjectItem, columns, headers]
    );
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
    React.useEffect(() => {
        if (prevMouseMove.current !== undefined) {
            popupContainer.removeEventListener('mousemove', prevMouseMove.current, {
                capture: true,
            });
        }
        popupContainer?.addEventListener('mousemove', onMouseMove, {
            capture: true,
        });
        prevMouseMove.current = onMouseMove;
    }, [onMouseMove]);
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
                itemClickForReplace,
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

    const markupElementsWidth = React.useMemo(() => {
        return calculateMarkupElementsWidth({
            gridColumnsWidth,
            scrollLeft,
            availableWidth: widgetHTMLElement?.querySelector('.controls-Grid')?.offsetWidth,
        });
    }, [gridColumnsWidth, scrollLeft, widgetHTMLElement]);

    const markupContent = React.useMemo(() => {
        return Markup({
            headers,
            markupElementsWidth,
            onAddButtonClick,
            onDeleteButtonClick,
            columns,
            onEdit,
            gridRowsHeight,
            getColumnValue,
            onReplaceColumnClick,
            scrollLeft,
            onMarkupElementMouseDown,
            onMarkupElementMouseMove,
            dragObjectId: dragObjectItem?.id,
        });
    }, [boundingRectContext, markupElementsWidth, scrollLeft, dragObjectItem]);
    return (
        <Container
            resetTextSelection={false}
            draggingTemplateOffset={0}
            draggingTemplate={null}
            onDocumentDragStart={onDragStart}
            onDocumentDragEnd={onDragEnd}
            customEvents={['onDocumentDragEnd', 'onDocumentDragStart']}
            ref={dndContainerRef}
        >
            <div
                style={markupContent.style}
                className={'ControlsListsEditors_columnsDesignTime-markup_container '}
            >
                {markupContent.content}
            </div>
        </Container>
    );
}
