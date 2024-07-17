import { BaseAction } from 'Controls/actions';
import { ISiteEditorSlice } from 'FrameEditor/interfaces';
import { createToolbarButton } from 'SiteEditorBase/toolbarFactory';
import { FRAME_ID, FOLDER_DEFAULT_PARAMS } from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    createTree,
    INode,
    forEachNode,
    updateTree,
    buildTreeParams,
    calculateSelectionState,
    buildTreeControlItems,
    findNode,
    setSelectionState,
    IBuildTreeResult,
    ITreeControlItem,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/baseGrid';
import { IElementFacade, IFrameFacade, modifyFrameRecursively } from 'Frame/base';
import { StackOpener } from 'Controls/popup';
import ExpandedSource from 'Controls-Lists-editors/_columnsEditor/source/ExpandedSource';
import { Loader } from 'Controls-DataEnv/dataLoader';
import rk = require('i18n!Controls-Lists-editors');
import {
    getUnusedColumns,
    IUnusedColumn,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { openPopupEditor } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';

interface IOpenFolderEditorPopupParams {
    slice: ISiteEditorSlice;
    editingParams: IBuildTreeResult;
    folder: INode;
    allColumns: TColumnsForCtor;
    allHeader: THeaderForCtor;
}

export const addNewFolderAction = createToolbarButton({
    id: 'addNewFolder',
    icon: 'icon-CreateFolder',
    iconStyle: 'default',
    tooltip: rk('Добавить папку'),
    actionName: 'Controls-Lists-editors/columnsEditor:AddNewFolder',
});

function addToFolder(folderRoot: INode) {
    return (pointer: INode) => {
        if (pointer.selected && !pointer.parent.selected) {
            folderRoot.children.push(pointer);
        }
    };
}

function onChange(slice: ISiteEditorSlice): (value: IElementFacade) => void {
    return (value: IElementFacade) => {
        const frameFacade: IFrameFacade = slice.getFrame(FRAME_ID).frameFacade;
        const newFrameFacade: IFrameFacade = modifyFrameRecursively(frameFacade, () => {
            return value;
        });
        slice.changeFrame(FRAME_ID, newFrameFacade);
    };
}

function updateFrame(slice: ISiteEditorSlice, newParams: IBuildTreeResult) {
    const frameFacade: IFrameFacade = slice.getFrame(FRAME_ID).frameFacade;
    const value = frameFacade.getContent()[0];
    const newStaticProperties = {
        ...value.getStaticProperties(),
        editingHeaders: newParams.header,
        editingColumns: newParams.columns,
        selectedColumnsIdxs: [],
    };
    const newValue = value.modify({
        staticProperties: newStaticProperties,
    });
    onChange(slice)(newValue);
}

function openFolderEditorPopup(params: IOpenFolderEditorPopupParams) {
    const { slice, editingParams, folder, allHeader, allColumns } = params;
    const popupEditorOpener = new ObjectEditorOpener();
    const frameFacade: IFrameFacade = slice.getFrame(FRAME_ID).frameFacade;
    const value = frameFacade.getContent()[0];
    const idx = editingParams.header.findIndex((header) => {
        return (
            folder?.startColumn === header.startColumn &&
            folder.endColumn === header.endColumn &&
            folder.startRow === header.startRow &&
            folder.endRow
        );
    });
    openPopupEditor({
        view: 'folder',
        columns: editingParams.columns,
        headers: editingParams.header,
        allColumns,
        allHeader,
        id: idx,
        value: {
            caption: editingParams.header[idx].caption,
            textOverflow: editingParams.header[idx].textOverflow,
            align: editingParams.header[idx].align,
        },
        opener: popupEditorOpener,
        siteEditorContext: {
            value,
            onChange: onChange(slice),
        },
    });
}

/**
 * Объединяет в новую папку отмеченные элементы и вставляет ее в дерево
 * возвращает null, если ничего не отмечено
 * @param tree Указатель на корень дерева
 */
function mergeSelectedElementsIntoFolder(tree: INode): INode | null {
    const newNode: INode = {
        parent: tree,
        children: [],
        header: {
            caption: rk(FOLDER_DEFAULT_PARAMS.caption),
            align: FOLDER_DEFAULT_PARAMS.align,
            textOverflow: 'ellipsis',
        },
    };
    // Создадим новый узел. Свяжем его со всеми отмеченными узлами
    forEachNode(tree, addToFolder(newNode));
    if (newNode.children.length > 0) {
        // Проверим, все ли отмеченные колонки имеют одного родителя
        let hasCommonParent = true;
        const children = newNode.children[0];
        let parent = children.parent;
        for (let i = 1; i < newNode.children.length; i++) {
            if (newNode.children[i].parent !== parent) {
                hasCommonParent = false;
                break;
            }
        }
        // Если родители разные, то папку располагаем в корне
        if (!hasCommonParent) {
            parent = tree;
        }
        let firstChildPosition = 0;
        for (let i = 0; i < newNode.children.length; i++) {
            // Удалим связь узла с предыдущим родителем
            const oldParent = newNode.children[i].parent;
            const idx = oldParent?.children.findIndex((child) => {
                return child === newNode.children[i];
            });
            if (idx !== -1) {
                oldParent?.children.splice(idx, 1);
            }
            if (i === 0) {
                firstChildPosition = idx;
            }
            // Установим нового родителя
            newNode.children[i].parent = newNode;
        }
        if (hasCommonParent) {
            parent?.children.splice(firstChildPosition, 0, newNode);
        } else parent?.children.push(newNode);
        newNode.parent = parent;
        return newNode;
    } else {
        return null;
    }
}

function getTreeControlConfig(items: ITreeControlItem) {
    return {
        columnsList: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new ExpandedSource({
                    keyProperty: 'key',
                    data: items,
                }),
                multiSelectVisibility: 'visible',
                parentProperty: 'parent',
                nodeProperty: 'type',
                keyProperty: 'key',
                expandedItems: [null],
                selectedKeys: [],
                searchParam: 'title',
                displayProperty: 'title',
            },
        },
    };
}

export class AddNewFolder extends BaseAction {
    onExecuteHandler = async () => {
        const slice = this.getSiteEditorSlice();
        const actualParams = slice
            ?.getFrame(FRAME_ID)
            .frameFacade.getContent()[0]
            .getStaticProperties();
        const actualColumns = actualParams.editingColumns;
        const actualHeaders = actualParams.editingHeaders;
        const allColumns = actualParams.allColumns;
        const allHeader = actualParams.allHeader;
        const actualSelectedColumnsIdxs: number[] = actualParams.selectedColumnsIdxs;
        if (actualColumns) {
            const headers: THeaderForCtor = [...actualHeaders];
            const columns: TColumnsForCtor = [...actualColumns];
            const selectionState = calculateSelectionState(headers, actualSelectedColumnsIdxs);
            // Создадим дерево
            const tree = createTree(headers, selectionState, columns);
            if (actualSelectedColumnsIdxs.length > 0) {
                const newFolder = mergeSelectedElementsIntoFolder(tree);
                updateTree(tree);
                const newParams: IBuildTreeResult = buildTreeParams(tree);
                updateFrame(slice, newParams);
                openFolderEditorPopup({
                    slice,
                    allColumns,
                    allHeader,
                    editingParams: newParams,
                    folder: newFolder,
                });
            } else {
                const dialog = new StackOpener();
                const editingItems: ITreeControlItem[] = buildTreeControlItems(
                    tree,
                    allColumns,
                    allHeader
                );
                const unusedColumns = getUnusedColumns(allColumns, allHeader, actualColumns);
                const unusedItems: ITreeControlItem[] = unusedColumns?.map((elem, elemIdx) => {
                    return {
                        key: editingItems.length + 1 + elemIdx,
                        title: elem.header.caption,
                        parent: null,
                        type: null,
                        hasChild: false,
                        status: rk('Еще можно добавить'),
                    };
                });
                const treeControlItems = [...editingItems, ...unusedItems];
                const dataConfig = getTreeControlConfig(treeControlItems);
                const loadResults = await Loader.load(dataConfig);
                dialog.open({
                    template: 'Controls-Lists-editors/columnsEditor:SelectionPopupRender',
                    templateOptions: {
                        loadResults,
                        dataConfig,
                    },
                    eventHandlers: {
                        onResult: (selectedKeys: number[]) => {
                            const newNodes: INode[] = [];
                            for (let i = 0; i < selectedKeys.length; i++) {
                                const idx = selectedKeys[i] - 1;
                                if (idx < editingItems.length) {
                                    const node = treeControlItems[idx].node;
                                    const selectedNode = findNode(
                                        tree,
                                        node.startColumn,
                                        node.endColumn,
                                        node.startRow,
                                        node.endRow
                                    );
                                    setSelectionState(selectedNode, true);
                                } else {
                                    const columnData: IUnusedColumn =
                                        unusedColumns[idx - editingItems.length];
                                    newNodes.push({
                                        parent: null,
                                        children: [],
                                        selected: false,
                                        startColumn: columnData.header.startColumn,
                                        endColumn: columnData.header.endColumn,
                                        startRow: columnData.header.startRow,
                                        endRow: columnData.header.endRow,
                                        header: columnData.header,
                                        column: columnData.column,
                                    });
                                }
                            }
                            updateTree(tree);
                            let newFolder = mergeSelectedElementsIntoFolder(tree);
                            if (newNodes.length > 0) {
                                if (newFolder === null) {
                                    newFolder = {
                                        parent: tree,
                                        children: [],
                                        header: {
                                            caption: rk(FOLDER_DEFAULT_PARAMS.caption),
                                            align: FOLDER_DEFAULT_PARAMS.align,
                                            textOverflow: 'ellipsis',
                                        },
                                    };
                                    tree.children.push(newFolder);
                                }
                                for (let i = 0; i < newNodes.length; i++) {
                                    newFolder.children.push(newNodes[i]);
                                    newNodes[i].parent = newFolder;
                                }
                            }
                            updateTree(tree);
                            const newParams: IBuildTreeResult = buildTreeParams(tree);
                            updateFrame(slice, newParams);
                            openFolderEditorPopup({
                                slice,
                                allColumns,
                                allHeader,
                                editingParams: newParams,
                                folder: newFolder,
                            });
                        },
                    },
                    closeOnOutsideClick: true,
                });
            }
        }
    };

    private getSiteEditorSlice(): ISiteEditorSlice | undefined {
        return this._options.context?.SiteEditorSlice as ISiteEditorSlice;
    }
}
