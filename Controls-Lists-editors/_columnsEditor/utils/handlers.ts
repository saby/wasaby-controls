import { Model } from 'Types/entity';
import { IColumn, TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import {
    createTree,
    findNode,
    updateTree,
    buildTreeParams,
    setSelectionState,
    calculateSelectionState,
    calculateSelectedIdx,
    ITreeControlItem,
    buildTreeControlItem,
    INode,
    deleteNode,
    buildTreeControlItems,
    changeParent,
    swipeNodes,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import { StackOpener } from 'Controls/popup';
import { ObjectType } from 'Meta/types';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { Logger } from 'UI/Utils';
import { ColumnEditor } from 'Controls-Lists-editors/_columnsEditor/editorClasses/column';
import { MainColumnEditor } from 'Controls-Lists-editors/_columnsEditor/editorClasses/mainColumn';
import { FolderEditor } from 'Controls-Lists-editors/_columnsEditor/editorClasses/folder';
import {
    BaseEditor,
    IEditingValue,
} from 'Controls-Lists-editors/_columnsEditor/editorClasses/base';
import * as React from 'react';
import ExpandedSource from 'Controls-Lists-editors/_columnsEditor/source/ExpandedSource';
import { Loader } from 'Controls-DataEnv/dataLoader';
import {
    getUnusedColumns,
    updateMainColumnWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import {
    ACTION_ADD,
    ACTION_DELETE,
    ACTION_MOVE,
    MAIN_COLUMN_INDEX,
    JS_GRID_SELECTOR,
    JS_GRID_COLUMN_SCROLL_THUMB_CLASSNAME,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import rk = require('i18n!Controls-Lists-editors');

interface ILoadData {
    loadData: object;
    loadConfig: object;
}

interface IOnElementDeleteCallbackResult {
    editingColumns: TColumnsForCtor;
    editingHeaders: THeaderForCtor;
    selectedColumnsIdxs: number[];
}

interface IOnEditElementCallbackResult {
    editingColumns: TColumnsForCtor;
    editingHeaders: THeaderForCtor;
}

interface IOnMouseMoveParams {
    widgetHTMLElement: HTMLElement;
    popupContainer: HTMLElement;
    prevScrollLeft: number | undefined;
    buttons: number;
    clientX: number;
    clientY: number;
    isDragging: boolean;
}

interface IOnItemClickForReplaceParams {
    item: Model;
    onValueChange: Function;
    onClose: Function;
    allColumns: IColumn[];
    editorProps: IOpenPopupEditor;
}

type TEditorView = 'folder' | 'column' | 'mainColumn';

export interface IPopupEditorProps {
    columns: TColumnsForCtor;
    headers: THeaderForCtor;
    allColumns: TColumnsForCtor;
    allHeader: THeaderForCtor;
    view: TEditorView;
    value: IMarkupValue;
    opener: ObjectEditorOpener;
    containerWidth?: number;
    /**
     * Пустые папки. Будут выведены в редакторе папки, но их нет в дереве редактора колонок
     */
    emptyFolders?: ITreeControlItem;
}

export interface IOpenPopupEditor extends IPopupEditorProps {
    id: number;
    columnEditorPopupContainer?: Element | null;
    /**
     * Ссылка на DOM-элемент редактируемой сущности
     */
    elementRef?: React.MutableRefObject<null>;
}

interface ICalculateCheckboxChange {
    /**
     * Id колонки/папки, у которой изменился чекбокс
     */
    id: number;
    /**
     * Новое состояние
     */
    state: boolean;
    headers: THeaderForCtor;
    columns: TColumnsForCtor;
    selectionState: boolean[];
}
interface ICalculateCheckboxChangeResult {
    headers: THeaderForCtor;
    columns: TColumnsForCtor;
    selectedColumnsIdxs: number[];
}

export interface IMarkupValue {
    caption: string;
    width: string;
    whiteSpace: string;
    align: string;
    columnValue: object;
    columnSeparatorSize: object;
}

// Утилиты - обработчики событий редактора колонок

/**
 * Обновить позицию горизонтального скрола
 * @param {IOnMouseMoveParams} params
 */
export function moveScrollLeft(params: IOnMouseMoveParams): number | undefined {
    const {
        popupContainer,
        prevScrollLeft,
        widgetHTMLElement,
        buttons,
        clientX,
        clientY,
        isDragging,
    } = params;
    const touchedScrollBar = document.elementsFromPoint(clientX, clientY).find((elem) => {
        return elem.className.includes?.(JS_GRID_COLUMN_SCROLL_THUMB_CLASSNAME);
    });
    const contentStyle = popupContainer?.querySelector(
        '.ControlsListsEditors_columnsDesignTime-markup_container'
    ).style;
    if (touchedScrollBar && !isDragging) {
        contentStyle.pointerEvents = 'none';
        popupContainer
            .querySelectorAll('.ControlsListsEditors_info-line')
            .forEach((el) => el.classList.add?.('ControlsListsEditors_info-line-animation-hidden'));
        popupContainer
            .querySelectorAll(
                '.ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
            )
            .forEach((el) => el.classList.add?.('tw-invisible'));
        return;
    } else if (buttons === 0) {
        const gridTransformStyle = getComputedStyle(
            widgetHTMLElement?.querySelector(JS_GRID_SELECTOR)
        )?.transform;
        let offsetString = gridTransformStyle.slice(0, gridTransformStyle.lastIndexOf(','));
        offsetString = offsetString.slice(offsetString.lastIndexOf(',') + 1);
        const nextLeftScrollWidth = Math.abs(Number(offsetString));
        if (contentStyle.pointerEvents === 'none' && nextLeftScrollWidth === prevScrollLeft) {
            contentStyle.pointerEvents = '';
            popupContainer
                .querySelectorAll('.ControlsListsEditors_info-line')
                .forEach(
                    (el) => el.classList.remove?.('ControlsListsEditors_info-line-animation-hidden')
                );
            popupContainer
                .querySelectorAll(
                    '.ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
                )
                .forEach((el) => el.classList.remove?.('tw-invisible'));
        }
        return nextLeftScrollWidth;
    }
}

export function itemClickForReplace(props: IOnItemClickForReplaceParams) {
    const { item, onValueChange, onClose, allColumns } = props;
    onValueChange({
        initCaption: item.getRawData().caption,
        displayProperty: allColumns[item.getRawData().startColumn - 1].displayProperty,
    });
    onClose();
}

export function onElementDeleteCallback(
    headers: THeaderForCtor,
    columns: TColumnsForCtor,
    selectedColumnsIdxs: number[],
    headerIdx: number
): IOnElementDeleteCallbackResult | undefined {
    const selectionState = calculateSelectionState(headers, selectedColumnsIdxs);
    const tree = createTree(headers, selectionState, columns);
    const headerToDelete = headers[headerIdx];
    const nodeToDelete = findNode(
        tree,
        headerToDelete.startColumn,
        headerToDelete.endColumn,
        headerToDelete.startRow,
        headerToDelete.endRow
    );
    if (nodeToDelete !== undefined) {
        deleteNode(nodeToDelete);
        updateTree(tree);
        const newParams = buildTreeParams(tree);
        const newColumns = newParams.columns;
        // Если после удаления находимся в минимальном состоянии, ширина главной колонки считается как у второстепенной
        if (newColumns.length === 2) {
            const mainColumn = newColumns[MAIN_COLUMN_INDEX];
            mainColumn.width = updateMainColumnWidth(mainColumn.width, true);
        }
        return {
            editingColumns: newParams.columns,
            editingHeaders: newParams.header,
            selectedColumnsIdxs: calculateSelectedIdx(newParams.selectionState),
        };
    } else {
        Logger.error('Удаляется несуществующий элемент');
    }
    return undefined;
}

export function onElementEditCallback(
    columns: TColumnsForCtor,
    header: THeaderForCtor,
    idx: number,
    newColumnProperties: object = {},
    newHeaderProperties: object = {}
): IOnEditElementCallbackResult {
    const newColumns = [...columns];
    const newHeader = [...header];
    const currentColumnIdx = newHeader[idx].startColumn - 1;
    const rightColumnIdx = currentColumnIdx + 1;
    const leftColumnIdx = currentColumnIdx - 1;
    newColumns[currentColumnIdx] = { ...columns[currentColumnIdx], ...newColumnProperties };
    // Если у колонки были отредактированы границы, то необходимо также изменить границы смежных колонок
    if (rightColumnIdx < newColumns.length) {
        newColumns[rightColumnIdx] = {
            ...columns[rightColumnIdx],
            columnSeparatorSize: {
                ...newColumns[rightColumnIdx].columnSeparatorSize,
                left: newColumns[currentColumnIdx].columnSeparatorSize?.right || 's',
            },
        };
    }
    if (leftColumnIdx >= 0) {
        newColumns[leftColumnIdx] = {
            ...columns[leftColumnIdx],
            columnSeparatorSize: {
                ...newColumns[leftColumnIdx].columnSeparatorSize,
                right: newColumns[currentColumnIdx].columnSeparatorSize?.left || 's',
            },
        };
    }
    newHeader[idx] = { ...header[idx], ...newHeaderProperties };
    return {
        editingColumns: newColumns,
        editingHeaders: newHeader,
    };
}

export function onOpenColumnsList(
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor,
    header: THeaderForCtor,
    columns: TColumnsForCtor,
    dialog: StackOpener,
    onItemClick: Function,
    onItemClickParams?: object,
    onResult?: Function,
    opener?: Element
) {
    // Список всех доступных колонок не включает в себя главную и фейковую колонки
    if (!dialog.isOpened() && allColumns.length + 2 !== columns.length) {
        dialog.open({
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
            eventHandlers: {
                onResult,
            },
            closeOnOutsideClick: true,
            opener,
        });
    }
}

function getLoadConfig(items: ITreeControlItem[], subRootKey: number | string) {
    return {
        subTree: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new ExpandedSource({
                    keyProperty: 'key',
                    data: items,
                }),
                parentProperty: 'parent',
                nodeProperty: 'type',
                keyProperty: 'key',
                expandedItems: [null],
                root: subRootKey,
            },
        },
    };
}

async function loadTreeData(
    tree: INode,
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor,
    subRootKey: number | string
): Promise<ILoadData> {
    const items: ITreeControlItem[] = [];
    for (let i = 0; i < tree.children.length; i++) {
        buildTreeControlItem(tree.children[i], 0, items, allColumns, allHeader);
    }
    const loadConfig = getLoadConfig(items, subRootKey);
    const loadData = await Loader.load(loadConfig);
    return {
        loadConfig,
        loadData,
    };
}

function getKey(node: INode, items: ITreeControlItem[]): number | string | undefined {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (node === item.node) {
            return item.key;
        }
    }
    return undefined;
}

export async function openPopupEditor(props: IOpenPopupEditor) {
    const {
        view,
        columns,
        headers,
        allColumns,
        allHeader,
        value,
        opener,
        id,
        columnEditorPopupContainer,
        elementRef,
        containerWidth,
        emptyFolders,
        siteEditorContext,
    } = props;
    let editor: BaseEditor;
    const tree = createTree(headers, undefined, columns);
    const subTree = findNode(
        tree,
        headers[id].startColumn,
        headers[id].endColumn,
        headers[id].startRow,
        headers[id].endRow
    );
    if (view === 'column') {
        editor = new ColumnEditor(
            value,
            headers,
            columns,
            allColumns,
            allHeader,
            elementRef,
            containerWidth
        );
    } else if (view === 'mainColumn') {
        const isMinimalState = columns.length === 1;
        editor = new MainColumnEditor(value, elementRef, containerWidth, isMinimalState);
    } else {
        const treeControlItems = buildTreeControlItems(tree, allColumns, allHeader);
        // Фейковый элемент нужно удалить
        treeControlItems.pop();
        const unusedColumns = getUnusedColumns(allColumns, allHeader, columns);
        const subRootKey = getKey(subTree, treeControlItems);
        const data = await loadTreeData(tree, allColumns, allHeader, subRootKey);
        editor = new FolderEditor(
            value,
            data.loadData,
            data.loadConfig,
            treeControlItems,
            subRootKey,
            unusedColumns,
            emptyFolders ?? []
        );
    }
    opener.open({
        metaType: ObjectType.id(String(id)).properties(editor.getMetaType()).title(rk('Колонка')),
        value: editor.getValue(),
        onChange: (newValue: IEditingValue) => {
            const popupProps = {
                columns,
                headers,
                allColumns,
                allHeader,
                value,
                elementRef,
                containerWidth,
                id,
                view,
                opener,
                siteEditorContext,
                emptyFolders,
            };
            let newStaticProperties;
            let shouldUpdatePopup;
            let newIdx = id;
            let newEmptyFolders = emptyFolders;
            if (newValue.subTree !== undefined) {
                if (newValue.subTree?.savedOptions?.emptyFolders) {
                    newEmptyFolders = newValue.subTree?.savedOptions?.emptyFolders;
                }
                const action = newValue.subTree.action;
                if (action === ACTION_DELETE) {
                    const node = newValue.subTree.items.node;
                    const interactionHeader = findNode(
                        tree,
                        node.startColumn,
                        node.endColumn,
                        node.startRow,
                        node.endRow
                    );
                    deleteNode(interactionHeader);
                } else if (action === ACTION_ADD) {
                    const items: ITreeControlItem[] = newValue.subTree.items;
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const node = item.node;
                        if (node?.parent !== null) {
                            const interactionHeader: INode = findNode(
                                tree,
                                node.startColumn,
                                node.endColumn,
                                node.startRow,
                                node.endRow
                            );
                            changeParent(interactionHeader, subTree);
                        } else changeParent(node, subTree);
                    }
                } else if (action === ACTION_MOVE) {
                    const items: ITreeControlItem[] = newValue.subTree.items;
                    const position: LOCAL_MOVE_POSITION = newValue.subTree.position;
                    const targetItem: ITreeControlItem | null = items.pop();
                    const dragItem = items.pop();
                    const dragNode: INode = findNode(
                        tree,
                        dragItem.node.startColumn,
                        dragItem.node.endColumn,
                        dragItem.node.startRow,
                        dragItem.node.endRow
                    );
                    let targetNode = tree;
                    if (targetItem !== null) {
                        targetNode = targetItem.node;
                        // Если перемещаем элемент в пустую папку, нужно создать для нее узел
                        if (!targetNode && position === 'on') {
                            targetNode = {
                                parent: subTree,
                                selected: false,
                                children: [],
                                header: {
                                    caption: targetItem.title,
                                    ...targetItem.headerOptions,
                                },
                            };
                            subTree.children.push(targetNode);
                        } else {
                            if (targetNode) {
                                targetNode = findNode(
                                    tree,
                                    targetItem.node.startColumn,
                                    targetItem.node.endColumn,
                                    targetItem.node.startRow,
                                    targetItem.node.endRow
                                );
                            }
                        }
                    }
                    if (position === 'on') {
                        let shouldChangeParent = false;
                        if (dragNode.children.length === 0) {
                            if (dragNode.parent !== targetNode) {
                                shouldChangeParent = true;
                            }
                        } else {
                            // Возможен сценарий, что пришла команда поместить папку во вложенную в нее папку. Это некорректно
                            const isNested: INode | undefined = findNode(
                                dragNode,
                                targetNode.startColumn,
                                targetNode.endColumn,
                                targetNode.startRow,
                                targetNode.endRow
                            );
                            if (!isNested) {
                                shouldChangeParent = true;
                            }
                        }
                        if (shouldChangeParent) {
                            changeParent(dragNode, targetNode);
                        }
                    } else {
                        const direction = position === 'before' ? 'left' : 'right';
                        if (targetNode) {
                            swipeNodes(dragNode, targetNode, direction);
                        }
                    }
                }
                updateTree(tree);
                const newConfig = buildTreeParams(tree);
                const newColumns = newConfig.columns;
                const isMinimalState = newColumns.length === 1;
                if (isMinimalState) {
                    newColumns[MAIN_COLUMN_INDEX].width = updateMainColumnWidth(
                        newColumns[MAIN_COLUMN_INDEX].width,
                        true
                    );
                }
                if (newConfig) {
                    const newHeader = newConfig.header;
                    newIdx = newHeader.findIndex((header) => {
                        return (
                            header.startColumn === subTree.startColumn &&
                            header.endColumn === subTree.endColumn &&
                            header.startRow === subTree.startRow &&
                            header.endRow === subTree.endRow
                        );
                    });
                    newStaticProperties = {
                        editingColumns: newConfig.columns,
                        editingHeaders: newConfig.header,
                        selectedColumnsIdxs: calculateSelectedIdx(newConfig.selectionState),
                    };
                    shouldUpdatePopup = true;
                }
            }
            const editingNodeExists = subTree?.parent !== null;
            if (editingNodeExists && newIdx !== -1) {
                if (
                    !shouldUpdatePopup &&
                    newValue.columnValue !== undefined &&
                    newValue.columnValue.displayProperty !== value.columnValue.displayProperty
                ) {
                    shouldUpdatePopup = true;
                }
                const updatedMarkupValue: IMarkupValue = editor.updateValue(value, newValue);
                const newColumnProperties =
                    view !== 'folder'
                        ? {
                              displayProperty: updatedMarkupValue.columnValue.displayProperty,
                              columnSeparatorSize: updatedMarkupValue.columnSeparatorSize,
                              width: updatedMarkupValue.width,
                              align: updatedMarkupValue.align,
                          }
                        : undefined;
                const newHeaderProperties = {
                    caption: updatedMarkupValue.caption,
                    align: updatedMarkupValue.align,
                    whiteSpace: updatedMarkupValue.whiteSpace,
                };
                newStaticProperties = {
                    ...onElementEditCallback(
                        newStaticProperties?.editingColumns || columns,
                        newStaticProperties?.editingHeaders || headers,
                        newIdx,
                        newColumnProperties,
                        newHeaderProperties
                    ),
                };
                popupProps.value = updatedMarkupValue;
            }
            const newSiteEditorValue = siteEditorContext.value.modify({
                staticProperties: {
                    ...siteEditorContext.value.getStaticProperties(),
                    ...newStaticProperties,
                },
            });
            siteEditorContext.onChange(newSiteEditorValue);
            if (shouldUpdatePopup) {
                if (editingNodeExists && newIdx !== -1) {
                    openPopupEditor({
                        ...popupProps,
                        columns: newStaticProperties.editingColumns,
                        headers: newStaticProperties.editingHeaders,
                        id: newIdx,
                        emptyFolders: newEmptyFolders,
                    });
                } else {
                    opener.close();
                }
            }
        },
        popupOptions: {
            opener: null,
            target: columnEditorPopupContainer,
            direction: { vertical: 'center', horizontal: 'center' },
            closeOnOutsideClick: true,
        },
        autoSave: true,
    });
}

export function calculateCheckboxChange(
    props: ICalculateCheckboxChange
): ICalculateCheckboxChangeResult {
    const { selectionState, headers, columns, state, id } = props;
    const currentHeader = headers[id];
    const tree = createTree(headers, selectionState, columns);
    const currentNode = findNode(
        tree,
        currentHeader.startColumn,
        currentHeader.endColumn,
        currentHeader.startRow,
        currentHeader.endRow
    );
    setSelectionState(currentNode, state);
    updateTree(tree);
    const newParams = buildTreeParams(tree);
    return {
        headers: newParams.header,
        columns: newParams.columns,
        selectedColumnsIdxs: calculateSelectedIdx(newParams.selectionState),
    };
}
