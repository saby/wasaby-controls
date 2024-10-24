import { default as MarkupElement } from './MarkupElement';
import {
    BoundingRectContext,
    IControlDesignerProps,
    IElementBoundingRect,
} from 'FrameEditor/player';
import { IHeaderCell, TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import * as React from 'react';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import { IBoundingRectContext } from 'FrameEditor/player';
import { StackOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import {
    COLUMN_INDEX_OFFSET,
    ADD_ON_RIGHT_MODE,
    ADD_ON_LEFT_MODE,
    INIT_SCROLL_LEFT,
    MAIN_COLUMN_INDEX,
    ADD_BUTTON_WIDTH,
    PERCENT_UNIT,
    JS_GRID_SELECTOR,
    JS_GRID_HEADER_SELECTOR,
    JS_GRID_COLUMN_SCROLL_THUMB_CLASSNAME,
    JS_GRID_TEMPLATE_SELECTOR,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { ColumnsEditorPopupContext } from 'Controls-Lists-editors/_columnsEditor/context/ColumnsEditorPopupContext';
import { SelectionContext } from 'Controls-Lists-editors/_columnsEditor/context/SelectionContext';
import { DragNDropContext } from 'Controls-Lists-editors/_columnsEditor/context/DragNDropContext';
import {
    calculateCheckboxChange,
    moveScrollLeft,
    onElementDeleteCallback,
    onElementEditCallback,
    onOpenColumnsList,
} from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import {
    getMaxHeaderRow,
    createTree,
    INode,
    findNode,
    buildTreeParams,
    updateTree,
    calculateSelectionState,
    calculateSelectedIdx,
    isNested,
    TArrayElement,
    swipeNodes,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import {
    getInitialColumnConfig,
    updateMainColumnWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { Container, Entity, IDragObject } from 'Controls/dragnDrop';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import {
    parseColumnWidth,
    resizeHandler,
    validateColumnWidth,
    validateColumnWidthInPercents,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { DataContext } from 'Controls-DataEnv/context';
import rk = require('i18n!Controls-Lists-editors');

interface IOnItemClickHandler {
    allColumns: TColumnsForCtor;
    columns: TColumnsForCtor;
    header: THeaderForCtor;
    onChange: Function;
    value: object;
    onClose: Function;
    neighbourIdx: number;
    mode: 'right' | 'left';
    item: Model<TArrayElement<THeaderForCtor>>;
    selectedColumnsIdxs: number[];
    maxHeaderRow: number;
}

interface IGridTemplate {
    gridTemplateColumns: string;
    gridTemplateRows: string;
}
interface IGetGridSizesParams {
    boundingRectContext: IBoundingRectContext;
    widgetHTMLElement?: HTMLElement;
}

interface IGetVisibleMarkupColumnsWidthParams {
    gridSizes: IElementBoundingRect[];
    scrollLeft: number | undefined;
    availableWidth: number;
    headers: THeaderForCtor;
}

interface IGetVisibleMarkupColumnsHeightParams {
    gridSizes: IElementBoundingRect[];
    availableHeight: number;
    headers: THeaderForCtor;
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
     * Высота элементов разметки
     */
    markupElementsHeight: number[];
    /**
     * Отступ сверху элементов разметки
     */
    markupElementsTop: number[];
    /**
     * Колбэк добавления колонки
     */
    onAddButtonClick: Function;
    /**
     * Колбэк удаления колонки
     */
    onDeleteButtonClick: Function;
    /**
     * Колбэк редактирования колонки
     */
    onEdit: Function;
    onCheckboxClick?: Function;
    scrollLeft?: boolean;
    onMarkupElementMouseDown?: Function;
    onMarkupElementMouseMove?: Function;
    onMarkupElementResize?: Function;
    dragObjectId?: number;
    /**
     * Opener окна редактирования колонки
     */
    popupEditorOpener: ObjectEditorOpener;
    allColumns: TColumnsForCtor;
    allHeader: THeaderForCtor;
    gridHeight: number;
    gridWidth: number;
}

interface IUpdateDragProperties {
    columns: TColumnsForCtor;
    header: THeaderForCtor;
    selectedColumnsIdxs: number[];
    dragElementIdx: number;
}

// TODO Утилита (разметка)
export function calculateGridTemplate(
    columns: TColumnsForCtor,
    gridRowsHeight: number[],
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
    gridRowsHeight.map((rowHeight: number | undefined) => {
        if (rowHeight) {
            gridTemplateRows += `${rowHeight}px` + ' ';
        }
    });
    return {
        gridTemplateColumns,
        gridTemplateRows: `${gridTemplateRows} 1fr`,
    };
}

function onCheckboxClickCallback(
    selectionState: boolean[],
    onChange: Function,
    value: object,
    id: number,
    headers: THeaderForCtor,
    columns: TColumnsForCtor,
    state: boolean
) {
    const result = calculateCheckboxChange({
        id,
        state,
        selectionState,
        columns,
        headers,
    });
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumnsIdxs: result.selectedColumnsIdxs,
        editingColumns: result.columns,
        editingHeaders: result.headers,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
}

function updateDragProperties(
    columns: TColumnsForCtor,
    header: THeaderForCtor,
    selectedColumnsIdxs: number[],
    dragElementIdx: number,
    targetElementIdx: number,
    direction: 'left' | 'right'
): IUpdateDragProperties {
    const dragElement = header[dragElementIdx];
    const targetElement = header[targetElementIdx];
    const selectionState = calculateSelectionState(header, selectedColumnsIdxs);
    const tree = createTree(header, selectionState, columns);
    const dragElementNode = findNode(
        tree,
        dragElement.startColumn,
        dragElement.endColumn,
        dragElement.startRow,
        dragElement.endRow
    );
    const targetElementNode = findNode(
        tree,
        targetElement.startColumn,
        targetElement.endColumn,
        targetElement.startRow,
        targetElement.endRow
    );
    swipeNodes(dragElementNode, targetElementNode, direction);
    updateTree(tree);
    const newParams = buildTreeParams(tree);
    const newDragElementIdx = newParams.header.findIndex((elem: IHeaderCell) => {
        return (
            dragElementNode.startColumn === elem.startColumn &&
            dragElementNode.endColumn === elem.endColumn &&
            dragElementNode.startRow === elem.startRow &&
            dragElementNode.endRow === elem.endRow
        );
    });
    return {
        columns: newParams.columns,
        header: newParams.header,
        selectedColumnsIdxs: calculateSelectedIdx(newParams.selectionState),
        dragElementIdx: newDragElementIdx,
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
    const newStaticProperties = {
        ...value.getStaticProperties(),
        ...onElementEditCallback(columns, header, idx, newColumnProperties, newHeaderProperties),
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
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
/**
 * Обработчик добавления колонки по клику на элемент списка
 * @param params {IOnItemClickHandler}
 */
export function onItemClickForAdd(params: IOnItemClickHandler) {
    const {
        item,
        allColumns,
        columns,
        header,
        value,
        onChange,
        onClose,
        mode,
        neighbourIdx,
        selectedColumnsIdxs,
    } = params;
    const headerConfig: TArrayElement<THeaderForCtor> = item.getRawData();
    const offset =
        mode === ADD_ON_RIGHT_MODE ? COLUMN_INDEX_OFFSET.right : COLUMN_INDEX_OFFSET.left;
    const neighbourColumnIdx = header[neighbourIdx].startColumn - 1;
    const columnToAdd = {
        ...allColumns[headerConfig.startColumn - 1],
    };
    columnToAdd.columnSeparatorSize = {
        ...allColumns[headerConfig.startColumn - 1].columnSeparatorSize,
    };
    columnToAdd.columnSeparatorSize[
        mode === ADD_ON_RIGHT_MODE ? ADD_ON_LEFT_MODE : ADD_ON_RIGHT_MODE
    ] = columns[neighbourColumnIdx].columnSeparatorSize?.[mode] || 's';
    if (
        (mode === ADD_ON_RIGHT_MODE && neighbourColumnIdx + 1 < columns.length) ||
        (mode === ADD_ON_LEFT_MODE && neighbourColumnIdx - 1 >= 0)
    ) {
        const modeNeighbourIndex =
            mode === ADD_ON_RIGHT_MODE ? neighbourColumnIdx + 1 : neighbourColumnIdx - 1;
        columns[modeNeighbourIndex].columnSeparatorSize = {
            ...columns[modeNeighbourIndex].columnSeparatorSize,
        };
        columns[modeNeighbourIndex].columnSeparatorSize[
            mode === ADD_ON_RIGHT_MODE ? ADD_ON_LEFT_MODE : ADD_ON_RIGHT_MODE
        ] = columnToAdd.columnSeparatorSize?.[mode] || 's';
    }
    const colspanParams = {
        startColumn: header[neighbourIdx].startColumn + offset,
        endColumn: header[neighbourIdx].endColumn + offset,
        startRow: header[neighbourIdx].startRow,
        endRow: header[neighbourIdx].endRow,
    };
    const selectionState = calculateSelectionState(header, selectedColumnsIdxs);
    const tree = createTree(header, selectionState, columns);
    const newNode: INode = {
        parent: null,
        children: [],
        selected: false,
        header: headerConfig,
        ...colspanParams,
        column: columnToAdd,
    };
    const neighbourColumn = header[neighbourIdx];
    const neighbourNode = findNode(
        tree,
        neighbourColumn.startColumn,
        neighbourColumn.endColumn,
        neighbourColumn.startRow,
        neighbourColumn.endRow
    );
    const parent = neighbourNode.parent;
    const childIdx = parent.children.findIndex((child) => {
        return child === neighbourNode;
    });
    if (childIdx !== -1) {
        parent.children.splice(childIdx + offset, 0, newNode);
    }
    newNode.parent = parent;
    updateTree(tree);
    const newParams = buildTreeParams(tree);
    // Если до этого находились в минимальном состоянии, ширина главной колонки считается как обычно
    if (columns.length === 2) {
        const newColumns = newParams.columns;
        newColumns[MAIN_COLUMN_INDEX].width = updateMainColumnWidth(
            newColumns[MAIN_COLUMN_INDEX].width,
            false
        );
    }
    const newSelectedColumnsIdx = calculateSelectedIdx(newParams.selectionState);
    const newStaticProperties = {
        ...value.getStaticProperties(),
        editingColumns: newParams.columns,
        editingHeaders: newParams.header,
        selectedColumnsIdxs: newSelectedColumnsIdx,
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
        columns,
        allColumns,
        allHeader,
        onAddButtonClick,
        onDeleteButtonClick,
        onEdit,
        markupElementsWidth,
        markupElementsHeight,
        markupElementsTop,
        scrollLeft,
        onMarkupElementMouseDown,
        onMarkupElementMouseMove,
        onMarkupElementResize,
        onCheckboxClick,
        popupEditorOpener,
        gridHeight,
        gridWidth,
        siteEditorContext,
    } = params;
    const markupContent = [];
    const gridRowsHeight: number[] = [];
    const templateColumnsWidth: number[] = [];
    const maxHeaderRow = getMaxHeaderRow(headers);
    const areAllColumns = columns.length === allColumns.length + 2;
    let maxColumnTop: number = -1;
    for (let i = 0; i < headers.length - 1; i++) {
        const header = headers[i];
        const isFolder: boolean = header.endRow && header.endRow < maxHeaderRow;
        if (!isFolder) {
            if (markupElementsTop[i] > maxColumnTop || maxColumnTop === -1) {
                maxColumnTop = markupElementsTop[i];
            }
        }
    }
    const isMinimalState: boolean = columns.length === 2;
    let showMinimalStateAddButton = false;
    if (isMinimalState) {
        const width = markupElementsWidth[MAIN_COLUMN_INDEX];
        if (width <= gridWidth - ADD_BUTTON_WIDTH) {
            showMinimalStateAddButton = true;
        }
    }
    for (let i = 0; i < headers.length - 1; i++) {
        const header = headers[i];
        const columnStyle = {
            gridColumn: `${header?.startColumn}/${header?.endColumn}`,
            gridRow: `${header?.startRow}/${header?.endRow}`,
        };
        const zIndex = header.endRow;
        const isFolder: boolean = header.endRow && header.endRow < maxHeaderRow;
        if (isFolder) {
            if (
                gridRowsHeight[header.startRow - 1] === undefined ||
                gridRowsHeight[header.startRow - 1] > markupElementsHeight[i]
            )
                gridRowsHeight[header.startRow - 1] = markupElementsHeight[i];
        }
        if (!isFolder) {
            templateColumnsWidth[header.startColumn - 1] = markupElementsWidth[i];
        }
        const currentColumn = header.startColumn - 1;
        const markupValue = {
            caption: header.caption,
            width: columns[currentColumn].width,
            whiteSpace: header.whiteSpace,
            align: header.align,
            columnValue: {
                initCaption: getInitialColumnConfig(columns[currentColumn], allColumns, allHeader)
                    .caption,
                displayProperty: columns[currentColumn].displayProperty,
            },
            columnSeparatorSize: columns[currentColumn].columnSeparatorSize,
            cellPadding: columns[currentColumn].cellPadding,
        };
        const isMainColumn: boolean = i === MAIN_COLUMN_INDEX;
        let resizeLinePosition: 'none' | 'left' | 'right' = 'none';
        if (!isFolder && !isMinimalState) {
            if (!isMainColumn && (scrollLeft === undefined || i === headers.length - 1)) {
                resizeLinePosition = 'left';
            } else if (scrollLeft !== undefined) {
                resizeLinePosition = 'right';
            }
        }
        const editorView = isFolder ? 'folder' : isMainColumn ? 'mainColumn' : 'column';
        const popupEditorProps = {
            value: markupValue,
            onEdit,
            opener: popupEditorOpener,
            columns,
            headers,
            allColumns,
            allHeader,
            view: editorView,
            containerWidth: gridWidth,
            siteEditorContext,
        };
        const parsedWidth = parseColumnWidth(markupValue.width);
        const informationLineProps = !isFolder
            ? {
                  isMainColumn: isMainColumn && !isMinimalState,
                  rightCellPadding: markupValue.cellPadding?.right ?? 'm',
                  leftCellPadding: markupValue.cellPadding?.left ?? 'm',
                  width:
                      parsedWidth.units === PERCENT_UNIT
                          ? validateColumnWidthInPercents(parsedWidth, gridWidth, isMainColumn)
                          : validateColumnWidth(parsedWidth, isMainColumn),
                  offsetTop: markupElementsTop[i],
              }
            : undefined;
        const size = {
            offsetHeight: isFolder ? gridHeight - markupElementsTop[i] : markupElementsHeight[i],
            offsetWidth: markupElementsWidth[i],
        };
        markupContent.push(
            <MarkupElement
                key={`markup-element_${i}`}
                qaMarkupKey={header.key}
                id={i}
                style={columnStyle}
                initZIndex={zIndex}
                popupEditorProps={popupEditorProps}
                onDeleteButtonClick={!isMainColumn ? onDeleteButtonClick : undefined}
                onLeftAddButtonClick={
                    !isMainColumn && !isFolder && !areAllColumns ? onAddButtonClick : undefined
                }
                onRightAddButtonClick={
                    !showMinimalStateAddButton && !isFolder && !areAllColumns
                        ? onAddButtonClick
                        : undefined
                }
                resizeLinePosition={resizeLinePosition}
                onMouseDown={onMarkupElementMouseDown}
                onMouseMove={onMarkupElementMouseMove}
                onResize={onMarkupElementResize}
                onCheckboxClick={!isMainColumn ? onCheckboxClick : undefined}
                actionsOffset={!isFolder ? maxColumnTop - markupElementsTop[i] : 0}
                deleteIcon={`${
                    isFolder ? 'Controls-Lists-editors-icons/folder:icon-SplitFolder' : 'icon-Erase'
                }`}
                deleteButtonTooltip={isFolder ? rk('Разбить папку') : rk('Удалить колонку')}
                informationLineProps={informationLineProps}
                size={size}
            />
        );
    }
    const markupStyle = calculateGridTemplate(columns, gridRowsHeight, templateColumnsWidth);
    return { content: markupContent, style: markupStyle };
}

// TODO Утилита (разметка)
/**
 * Получить актуальные ширины колонок в grid:View
 * @param props
 */
function getGridSizes(props: IGetGridSizesParams): IElementBoundingRect[] | undefined {
    const { boundingRectContext, widgetHTMLElement } = props;
    const headersHTML = widgetHTMLElement?.getElementsByClassName('controls-Grid__header-cell');
    if (headersHTML) {
        const newGridSizes: IElementBoundingRect[] = [];
        for (let i = 0; i < headersHTML?.length; i++) {
            newGridSizes[i] = boundingRectContext.getElementBoundingRect(headersHTML[i]);
        }
        return newGridSizes;
    }
    return undefined;
}

function calculateMarkupElementsHeight(params: IGetVisibleMarkupColumnsHeightParams) {
    const { gridSizes, availableHeight, headers } = params;
    const maxHeaderRow = getMaxHeaderRow(headers);
    const result = [];
    if (gridSizes.length > 0) {
        for (let i = 0; i < gridSizes.length; i++) {
            const header = headers[i];
            const isFolder = header.endRow && header.endRow < maxHeaderRow;
            const headerTop = gridSizes[i].top;
            const headerHeight = gridSizes[i].height;
            if (isFolder) {
                result[i] = headerHeight;
            } else {
                result[i] = availableHeight - headerTop;
            }
        }
    }
    return result;
}

function calculateMarkupElementsWidth(params: IGetVisibleMarkupColumnsWidthParams): number[] {
    const { gridSizes, scrollLeft, availableWidth, headers } = params;
    const maxHeaderRow = getMaxHeaderRow(headers);
    const visibleColumnsWidth: number[] = gridSizes.map((size: IElementBoundingRect) => {
        return size.width;
    });
    let currentScrollLeft = scrollLeft;
    let currentAvailableWidth = availableWidth;
    if (currentScrollLeft !== undefined) {
        for (let i = 0; i < visibleColumnsWidth.length; i++) {
            const isFolder = headers[i].endRow < maxHeaderRow;
            // Папки при подсчете видимой части разметки не учитываются
            if (!isFolder) {
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
    }
    return visibleColumnsWidth;
}

/**
 * DesignTime редактор
 * @param {IControlDesignerProps} props Пропсы компонента
 * @category component
 * @private
 */
export default function ColumnsDesignTimeEditor(props: IControlDesignerProps) {
    const context = React.useContext(DataContext);
    const columns: TColumnsForCtor = React.useMemo(() => {
        const listSlice = context.GridWidgetSlice;
        return listSlice.state.columns;
    }, [context]);
    const headers: THeaderForCtor = React.useMemo(() => {
        const listSlice = context.GridWidgetSlice;
        return listSlice.state.header;
    }, [context]);
    const staticProperties = props.value.getStaticProperties();
    const allColumns: TColumnsForCtor = staticProperties.allColumns;
    const allHeader: THeaderForCtor = staticProperties.allHeader;
    const selectedColumnsIdxs: number[] = staticProperties.selectedColumnsIdxs;
    const { onChange, value } = props;
    const [markupWidths, setMarkupWidths] = React.useState<number[]>([]);
    const [markupHeights, setMarkupHeights] = React.useState<number[]>([]);
    const [markupTops, setMarkupTops] = React.useState<number[]>([]);
    const [scrollLeft, setScrollLeft] = React.useState<number | undefined>(INIT_SCROLL_LEFT);
    const boundingRectContext = React.useContext(BoundingRectContext);
    const widgetHTMLElement: HTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const popupContainer: HTMLElement =
        React.useContext(ColumnsEditorPopupContext).popupContainer?.current;
    const [dragObjectItem, setDragObjectItem] = React.useState<IDragObjectItem | undefined>(
        undefined
    );
    React.useLayoutEffect(() => {
        const actualGridSizes = getGridSizes({
            boundingRectContext,
            widgetHTMLElement,
        });
        if (actualGridSizes) {
            const widths = calculateMarkupElementsWidth({
                gridSizes: actualGridSizes,
                scrollLeft,
                headers,
                availableWidth: widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetWidth,
            });
            setMarkupWidths(widths);
            const heights = calculateMarkupElementsHeight({
                gridSizes: actualGridSizes,
                headers,
                availableHeight: widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetHeight,
            });
            setMarkupHeights(heights);
            const tops = actualGridSizes.map((size: IElementBoundingRect) => {
                return size.top;
            });
            setMarkupTops(tops);
        }
    }, [boundingRectContext, widgetHTMLElement, columns, headers, scrollLeft]);

    const mutationObserver = React.useMemo(() => {
        return new MutationObserver(() => {
            const actualGridSizes = getGridSizes({
                boundingRectContext,
                widgetHTMLElement,
            });
            if (actualGridSizes) {
                // Размеры стики шапки обновляются асинхронно, поэтому нужно дополнительно следить за ее изменениями
                const heights = calculateMarkupElementsHeight({
                    gridSizes: actualGridSizes,
                    headers,
                    availableHeight:
                        widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetHeight,
                });
                setMarkupHeights(heights);
                const tops = actualGridSizes.map((size: IElementBoundingRect) => {
                    return size.top;
                });
                setMarkupTops(tops);
            }
        });
    }, [boundingRectContext, widgetHTMLElement, headers]);

    const headerHTMLElement: HTMLElement =
        widgetHTMLElement?.querySelector(JS_GRID_HEADER_SELECTOR);

    React.useEffect(() => {
        if (headerHTMLElement) {
            mutationObserver.observe(headerHTMLElement, {
                childList: true,
                characterDataOldValue: true,
                characterData: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true,
            });
        }
        return () => {
            mutationObserver.disconnect();
        };
    }, [headerHTMLElement, mutationObserver]);

    const onMouseMove = React.useCallback(
        (event) => {
            const thumb = widgetHTMLElement?.querySelector(
                `.${JS_GRID_COLUMN_SCROLL_THUMB_CLASSNAME}`
            );
            if (thumb && !thumb.className.includes('ws-hidden')) {
                const nextScrollLeft = moveScrollLeft({
                    popupContainer,
                    prevScrollLeft: scrollLeft,
                    widgetHTMLElement,
                    buttons: event.buttons,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    isDragging: dragObjectItem !== undefined,
                });
                if (nextScrollLeft !== undefined) {
                    setScrollLeft(nextScrollLeft);
                }
            } else {
                setScrollLeft(undefined);
            }
        },
        [scrollLeft, dragObjectItem, popupContainer, widgetHTMLElement]
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
    const popupEditorOpener = React.useMemo(() => {
        return new ObjectEditorOpener();
    }, []);
    const onMarkupElementMouseMove = React.useCallback(
        (
            dragObject: IDragObjectItem,
            targetColumnIdx: number,
            offsetX: number,
            targetColumnWidth: number
        ) => {
            if (dragObject) {
                const dragObjectIdx = dragObject.id;
                const dragObjectWidth = dragObject.width;
                if (
                    dragObjectIdx &&
                    targetColumnIdx &&
                    targetColumnIdx !== dragObjectIdx &&
                    !isNested(headers[targetColumnIdx], headers[dragObjectIdx])
                ) {
                    let direction: 'none' | 'right' | 'left' = 'none';
                    if (!isNested(headers[dragObjectIdx], headers[targetColumnIdx])) {
                        if (
                            headers[targetColumnIdx].startColumn -
                                headers[dragObjectIdx].startColumn >
                                0 &&
                            offsetX > targetColumnWidth - dragObjectWidth
                        ) {
                            direction = 'right';
                        } else if (
                            headers[targetColumnIdx].startColumn -
                                headers[dragObjectIdx].startColumn <=
                                0 &&
                            offsetX < dragObjectWidth
                        ) {
                            direction = 'left';
                        }
                    } else {
                        const rightArea =
                            dragObjectWidth > targetColumnWidth / 2
                                ? targetColumnWidth / 2
                                : targetColumnWidth - dragObjectWidth;
                        const leftArea =
                            dragObjectWidth > targetColumnWidth / 2
                                ? targetColumnWidth / 2
                                : dragObjectWidth;
                        if (offsetX > rightArea) {
                            direction = 'right';
                        } else if (offsetX < leftArea) {
                            direction = 'left';
                        }
                    }
                    if (direction !== 'none') {
                        const updateDragObjectItem = { ...dragObject };
                        const newProperties = updateDragProperties(
                            columns,
                            headers,
                            selectedColumnsIdxs,
                            dragObjectIdx,
                            targetColumnIdx,
                            direction
                        );
                        updateDragObjectItem.id = newProperties.dragElementIdx;
                        setDragObjectItem(updateDragObjectItem);
                        const newStaticProperties = {
                            ...value.getStaticProperties(),
                            editingColumns: newProperties.columns,
                            editingHeaders: newProperties.header,
                            selectedColumnsIdxs: newProperties.selectedColumnsIdxs,
                        };
                        notifyContextValueChanged(onChange, value, newStaticProperties);
                    }
                }
            }
        },
        [columns, headers, onChange, value, selectedColumnsIdxs]
    );
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
    }, [onMouseMove, popupContainer]);
    React.useEffect(() => {
        return () => {
            if (popupEditorOpener.isOpened()) {
                popupEditorOpener.close();
            }
        };
    }, [popupEditorOpener]);
    const addColumnDialogOpener = React.useMemo(() => {
        return new StackOpener();
    }, []);
    const onEdit = React.useCallback(
        (id: number) => {
            return (
                newColumnProperties: object = {},
                newHeaderProperties: object = {},
                editorPopupProps: object | undefined = undefined
            ) => {
                return onColumnEditCallback(
                    onChange,
                    value,
                    columns,
                    headers,
                    id,
                    newColumnProperties,
                    newHeaderProperties,
                    editorPopupProps
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
                selectedColumnsIdxs,
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
        [
            allColumns,
            headers,
            columns,
            onChange,
            addColumnDialogOpener,
            allHeader,
            value,
            selectedColumnsIdxs,
        ]
    );
    const onDeleteButtonClick = React.useCallback(
        (idx: number) => {
            const newStaticProperties = {
                ...value.getStaticProperties(),
                ...onElementDeleteCallback(headers, columns, selectedColumnsIdxs, idx),
            };
            notifyContextValueChanged(onChange, value, newStaticProperties);
        },
        [headers, columns, onChange, value, selectedColumnsIdxs]
    );
    const onMarkupElementResize = React.useCallback(
        (id: number, direction: 'left' | 'right', gridTemplateWidth: string) => {
            return (offset: number) => {
                popupEditorOpener.close();
                const vectorSign = direction === 'left' ? -1 : 1;
                const headersHTML = widgetHTMLElement?.getElementsByClassName(
                    'controls-Grid__header-cell'
                );
                const columnHTML = boundingRectContext.getElementBoundingRect(headersHTML[id]);
                const gridHTML = boundingRectContext.getElementBoundingRect(
                    widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)
                );
                const isMainColumn = id === MAIN_COLUMN_INDEX;
                const newColumnProperties = {
                    width: resizeHandler({
                        columnHTMLWidth: columnHTML.width,
                        columnTemplateWidth: gridTemplateWidth,
                        offset: offset * vectorSign,
                        containerWidth: gridHTML.width,
                        isMainColumn,
                    }),
                };
                onEdit(id)(newColumnProperties);
            };
        },
        [widgetHTMLElement, boundingRectContext, onEdit, popupEditorOpener]
    );

    const addButtonStyle = React.useMemo(() => {
        if (markupWidths.length === 2) {
            const widths = [...markupWidths];
            const width = widths.shift();
            const availableWidth = widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetWidth;
            if (width <= availableWidth - ADD_BUTTON_WIDTH) {
                return {
                    left: `calc(${width}px + var(--offset_xs))`,
                };
            }
        }
        return undefined;
    }, [markupWidths, widgetHTMLElement]);

    const onCheckboxClick = React.useCallback(
        (idx: number, state: boolean, selectionState: boolean[]) => {
            return onCheckboxClickCallback(
                selectionState,
                onChange,
                value,
                idx,
                headers,
                columns,
                state
            );
        },
        [onChange, value, columns, headers]
    );
    const selectionContextValue = React.useMemo(() => {
        return headers.map((header, headerId) => {
            return selectedColumnsIdxs.indexOf(headerId) !== -1;
        });
    }, [selectedColumnsIdxs, headers]);
    const onMinimalStateButtonClick = React.useCallback(() => {
        onAddButtonClick(MAIN_COLUMN_INDEX, ADD_ON_RIGHT_MODE);
    }, [onAddButtonClick]);
    const markupContent = React.useMemo(() => {
        return Markup({
            headers,
            columns,
            allColumns,
            allHeader,
            markupElementsWidth: markupWidths,
            markupElementsHeight: markupHeights,
            markupElementsTop: markupTops,
            onAddButtonClick,
            onDeleteButtonClick,
            onEdit,
            scrollLeft,
            onMarkupElementMouseDown,
            onMarkupElementMouseMove,
            onMarkupElementResize,
            onCheckboxClick,
            popupEditorOpener,
            gridHeight: widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetHeight,
            gridWidth: widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)?.offsetWidth,
            siteEditorContext: {
                value,
                onChange,
            },
        });
    }, [
        markupWidths,
        markupHeights,
        markupTops,
        scrollLeft,
        allHeader,
        allColumns,
        columns,
        headers,
        onAddButtonClick,
        onDeleteButtonClick,
        onMarkupElementMouseDown,
        onMarkupElementMouseMove,
        onMarkupElementResize,
        onEdit,
        onCheckboxClick,
        popupEditorOpener,
        widgetHTMLElement,
        value,
        onChange,
    ]);
    return (
        <SelectionContext.Provider value={selectionContextValue}>
            <DragNDropContext.Provider value={dragObjectItem}>
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
                    {addButtonStyle ? (
                        <div
                            style={addButtonStyle}
                            className={
                                'ControlsListsEditors_columnsDesignTime-minimalState-add_button'
                            }
                            data-qa={
                                'ControlsListsEditors_columnsDesignTime-minimalState-add_button'
                            }
                            onClick={onMinimalStateButtonClick}
                        >
                            <div
                                className={
                                    'controls-icon controls-icon_size-l controls-icon_style-unaccented icon-Addition ControlsListsEditors_columnsDesignTime-minimalState-add_button_plus-icon'
                                }
                            />
                        </div>
                    ) : null}
                </Container>
            </DragNDropContext.Provider>
        </SelectionContext.Provider>
    );
}
