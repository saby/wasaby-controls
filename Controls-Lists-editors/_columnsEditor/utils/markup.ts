import { IColumn, TColumnsForCtor, THeaderForCtor } from 'Controls/baseGrid';
import { IHeaderCell } from 'Controls/baseGrid';
import { END_ROW, FIRST_COLUMN } from 'Controls-Lists-editors/_columnsEditor/constants';
import rk = require('i18n!Controls-Lists-editors');
import { getInitialColumnConfig } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { Logger } from 'UI/Utils';

// Утилита для получения типа элемента из массива.
export type TArrayElement<T> = T extends (infer U)[] ? U : never;

export interface INode {
    parent: INode | null;
    children: INode[];
    selected?: boolean;
    height?: number;
    column?: IColumn;
    startColumn: number;
    endColumn: number;
    startRow: number;
    endRow: number;
    header?: TArrayElement<THeaderForCtor>;
}

export interface ITreeControlItem {
    key: number | string;
    title: string;
    hasChild: boolean;
    type: boolean | null;
    parent: number | string | null;
    node?: INode;
    status?: string;
    customTitle?: string;
}

export interface IBuildTreeResult {
    header: THeaderForCtor;
    columns: TColumnsForCtor;
    selectionState: boolean[];
}

interface IBuildNodeParams {
    pointer: INode;
    header: THeaderForCtor;
    columns: TColumnsForCtor;
    selectionState: boolean[];
}

/**
 * Проверяет вложен ли заголовок/папка в папку
 * @param header
 * @param folder
 */
export function isNested(header: IHeaderCell, folder: IHeaderCell): boolean {
    return (
        folder.startRow < header.startRow &&
        folder.startColumn <= header.startColumn &&
        folder.endColumn >= header.endColumn
    );
}

// TODO Временное решение. Удалить, когда колонки и заголовки полностью будут заменены на дерево
export function calculateSelectionState(
    header: THeaderForCtor,
    selectedColumnsIdxs: number[]
): boolean[] {
    const selectionState = new Array(header.length).fill(false);
    for (let i = 0; i < selectedColumnsIdxs.length; i++) {
        selectionState[selectedColumnsIdxs[i]] = true;
    }
    return selectionState;
}

// TODO Временное решение
export function calculateSelectedIdx(selectionState: boolean[]): number[] {
    const newSelectedColumnsIdx = [];
    for (let i = 0; i < selectionState.length; i++) {
        if (selectionState[i]) {
            newSelectedColumnsIdx.push(i);
        }
    }
    return newSelectedColumnsIdx;
}

export function getMaxHeaderRow(headers: THeaderForCtor): number {
    let max = END_ROW;
    headers.forEach((header) => {
        if (header.endRow && header.endRow > max) {
            max = header.endRow;
        }
    });
    return max;
}

export function createTree(
    headers: THeaderForCtor,
    selectionState: boolean[] | undefined,
    columns: TColumnsForCtor
): INode {
    const rootNode: INode = {
        parent: null,
        children: [],
        selected: false,
        startRow: 0,
        endRow: 1,
        startColumn: 0,
        endColumn: headers.length + 1,
    };
    let selection = selectionState;
    if (selection === undefined) {
        selection = new Array(headers.length).fill(false);
    }
    defineChildren(headers, rootNode, selection, columns);
    return rootNode;
}

function defineChildren(
    headers: THeaderForCtor,
    pointer: INode,
    selectionState: boolean[],
    columns: TColumnsForCtor
) {
    const children: THeaderForCtor = [];
    const childrenSelection: boolean[] = [];
    const unusedHeaders: THeaderForCtor = [];
    const unusedHeadersSelection: boolean[] = [];
    const maxHeaderRow = getMaxHeaderRow(headers);
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const isDirectlyNested = header.startRow === pointer.endRow && isNested(header, pointer);
        if (isDirectlyNested) {
            children.push(header);
            childrenSelection.push(selectionState[i]);
        } else {
            unusedHeaders.push(header);
            unusedHeadersSelection.push(selectionState[i]);
        }
    }
    for (let i = 0; i < children.length; i++) {
        const isFolder = children[i].endRow < maxHeaderRow;
        const newNode: INode = {
            parent: pointer,
            children: [],
            selected: childrenSelection[i],
            column: !isFolder ? columns[children[i].startColumn - 1] : undefined,
            header: children[i],
            endColumn: children[i].endColumn,
            startRow: children[i].startRow,
            endRow: children[i].endRow,
            startColumn: children[i].startColumn,
        };
        pointer.children.push(newNode);
        defineChildren(unusedHeaders, newNode, unusedHeadersSelection, columns);
    }
}

/**
 * Возвращает высоту дерева и сохраняет ее в данных корня
 * @param pointer указатель на корень дерева
 */
export function calculateTreeHeight(pointer: INode): number {
    let maxSubTreeHeight: number = -1;
    for (let i = 0; i < pointer.children.length; i++) {
        const child = pointer.children[i];
        const subTreeHeight = calculateTreeHeight(child);
        if (maxSubTreeHeight === -1 || subTreeHeight > maxSubTreeHeight) {
            maxSubTreeHeight = subTreeHeight;
        }
    }
    pointer.height = maxSubTreeHeight + 1;
    return maxSubTreeHeight + 1;
}
export function updateTree(root: INode) {
    const treeHeight = calculateTreeHeight(root);
    updateChildren(root, treeHeight + 1, FIRST_COLUMN);
}

function updateChildren(pointer: INode, rootHeight: number, startColumn: number) {
    if (pointer.children.length === 0) {
        const isEmptyFolder =
            pointer.column === undefined && pointer.startColumn === pointer.endColumn;
        // Если пустая папка, то игнорируем
        if (!isEmptyFolder) {
            pointer.startColumn = startColumn;
            pointer.endColumn = startColumn + 1;
            pointer.endRow = rootHeight;
            pointer.startRow = rootHeight - pointer.parent.height;
        }
    } else {
        let maxEndColumn = startColumn + 1;
        let selected = true;
        for (let i = 0; i < pointer.children.length; i++) {
            updateChildren(
                pointer.children[i],
                rootHeight,
                i === 0 ? startColumn : pointer.children[i - 1].endColumn
            );
            if (pointer.children[i].endColumn > maxEndColumn) {
                maxEndColumn = pointer.children[i].endColumn;
            }
            selected = selected && pointer.children[i].selected;
        }
        if (pointer.parent !== null) {
            pointer.startColumn = startColumn;
            pointer.endColumn = maxEndColumn;
            pointer.endRow = rootHeight - pointer.height;
            pointer.startRow = rootHeight - pointer.parent.height;
            pointer.selected = selected;
        }
    }
}

export function forEachNode(pointer: INode, callback: (pointer: INode) => void) {
    if (pointer.parent !== null) {
        callback(pointer);
    }
    for (let i = 0; i < pointer.children.length; i++) {
        forEachNode(pointer.children[i], callback);
    }
}

export function findNode(
    pointer: INode,
    startColumn: number,
    endColumn: number,
    startRow: number,
    endRow: number
): INode | undefined {
    if (
        pointer.parent !== null &&
        pointer.startColumn === startColumn &&
        pointer.endColumn === endColumn &&
        pointer.startRow === startRow &&
        pointer.endRow === endRow
    ) {
        return pointer;
    } else {
        for (let i = 0; i < pointer.children.length; i++) {
            const result = findNode(pointer.children[i], startColumn, endColumn, startRow, endRow);
            if (result !== undefined) {
                return result;
            }
        }
        return undefined;
    }
}

export function buildTreeParams(pointer: INode): IBuildTreeResult {
    const header: THeaderForCtor = [];
    const columns: TColumnsForCtor = [];
    const selectionState: boolean[] = [];
    buildNodeParams({ pointer, header, columns, selectionState });
    return {
        header,
        columns,
        selectionState,
    };
}

function buildNodeParams(params: IBuildNodeParams) {
    const { header, columns, selectionState, pointer } = params;
    if (pointer.parent !== null) {
        const isEmptyFolder =
            pointer.column === undefined && pointer.startColumn === pointer.endColumn;
        if (!isEmptyFolder) {
            header.push({
                ...pointer.header,
                startColumn: pointer.startColumn,
                endColumn: pointer.endColumn,
                startRow: pointer.startRow,
                endRow: pointer.endRow,
            });
        }
        if (pointer.column) {
            columns[pointer.startColumn - 1] = pointer.column;
        }
        selectionState.push(pointer.selected !== undefined ? pointer.selected : false);
    }
    for (let i = 0; i < pointer.children.length; i++) {
        buildNodeParams({ ...params, pointer: pointer.children[i] });
    }
}

export function setSelectionState(pointer: INode, state: boolean) {
    pointer.selected = state;
    for (let i = 0; i < pointer.children.length; i++) {
        setSelectionState(pointer.children[i], state);
    }
}

export function buildTreeControlItems(
    pointer: INode,
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor
): ITreeControlItem[] {
    const items: ITreeControlItem[] = [];
    buildTreeControlItem(pointer, 0, items, allColumns, allHeader);
    return items;
}

export function buildTreeControlItem(
    pointer: INode,
    parentIdx: number,
    items: ITreeControlItem[],
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor
) {
    let idx = 0;
    if (pointer.parent !== null && pointer.startColumn !== 1) {
        idx = items.length + 1;
        let initialCaption;
        if (pointer.column) {
            initialCaption = getInitialColumnConfig(pointer.column, allColumns, allHeader).caption;
        }
        const customCaption = pointer.header.caption;
        const newItem = {
            key: idx,
            title: initialCaption || customCaption,
            parent: parentIdx === 0 ? null : parentIdx,
            type: pointer.column !== undefined && pointer.children.length === 0 ? null : true,
            hasChild: pointer.children.length !== 0,
            status: rk('Присутствуют в таблице'),
            node: pointer,
            customTitle:
                initialCaption && customCaption !== initialCaption ? customCaption : undefined,
        };
        items.push(newItem);
    }
    for (let i = 0; i < pointer.children.length; i++) {
        buildTreeControlItem(pointer.children[i], idx, items, allColumns, allHeader);
    }
}

export function deleteNode(node: INode) {
    // Удаляем до тех пор, пока не останется пустых папок
    do {
        const currentParent = node.parent;
        const childIdx = currentParent.children.findIndex((child) => {
            return child === node;
        });
        if (childIdx !== -1) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                child.parent = currentParent;
            }
            currentParent.children.splice(childIdx, 1, ...node.children);
        }
        node.parent = null;
        node = currentParent;
    } while (node.children.length === 0 && node.parent !== null);
}

export function changeParent(node: INode, newParent: INode) {
    const oldParent = node.parent;
    if (oldParent !== null) {
        const idx = oldParent?.children.findIndex((child) => {
            return child === node;
        });
        if (idx !== -1) {
            oldParent?.children.splice(idx, 1);
            if (oldParent.children.length === 0 && oldParent.parent !== null) {
                deleteNode(oldParent);
            }
        } else {
            Logger.error('Переданы некорректные данные');
            return;
        }
    }
    node.parent = newParent;
    newParent.children.push(node);
}

export function swipeNodes(dragNode: INode, targetNode: INode, direction: 'left' | 'right') {
    const dragElementNodeIdx = dragNode.parent.children.findIndex((child) => {
        return child === dragNode;
    });
    let targetElementNodeIdx = targetNode.parent.children.findIndex((child) => {
        return child === targetNode;
    });
    if (dragElementNodeIdx !== -1 && targetElementNodeIdx !== -1) {
        if (dragNode.parent === targetNode.parent) {
            const commonParent = dragNode.parent;
            commonParent.children.splice(dragElementNodeIdx, 1);
            targetElementNodeIdx = targetNode.parent.children.findIndex((child) => {
                return child === targetNode;
            });
            if (direction === 'right') {
                commonParent.children.splice(targetElementNodeIdx + 1, 0, dragNode);
            } else {
                commonParent.children.splice(targetElementNodeIdx, 0, dragNode);
            }
        } else {
            const dragElementNodeParent = dragNode.parent;
            dragElementNodeParent.children.splice(dragElementNodeIdx, 1);
            const targetElementNodeParent = targetNode.parent;
            if (direction === 'left') {
                targetElementNodeParent.children.splice(targetElementNodeIdx, 0, dragNode);
            } else {
                targetElementNodeParent.children.splice(targetElementNodeIdx + 1, 0, dragNode);
            }
            // Если элемент находился в папке, проверим, не стала ли она пустой и так выше по иерархии
            if (
                dragElementNodeParent?.children.length === 0 &&
                dragElementNodeParent.parent !== null
            ) {
                deleteNode(dragElementNodeParent);
            }
            dragNode.parent = targetElementNodeParent;
        }
    } else Logger.error('Некорректно построено дерево');
}

export function countSelectedColumns(node: INode): number {
    if (node.parent !== null && node.children.length === 0) {
        if (node.selected) {
            return 1;
        } else return 0;
    } else {
        let result = 0;
        for (let i = 0; i < node.children.length; i++) {
            const children = node.children[i];
            result += countSelectedColumns(children);
        }
        return result;
    }
}

/**
 * Найти самого высокого по иерархии предка, который соответствует колонке или папке
 * @param node узел, для которого необходимо найти предка
 */
export function getHighestAncestor(node: INode): INode {
    if (node.parent.parent === null) {
        return node;
    } else {
        return getHighestAncestor(node.parent);
    }
}
