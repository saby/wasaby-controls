import { View } from 'Controls/treeGrid';
import { Container as ScrollContainer } from 'Controls/scroll';
import * as React from 'react';
import { IItemAction } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import {
    findNode,
    getHighestAncestor,
    INode,
    ITreeControlItem,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';
import { useSlice } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { StackOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import ExpandedSource from 'Controls-Lists-editors/_columnsEditor/source/ExpandedSource';
import { Record } from 'Types/entity';
import { FOLDER_DEFAULT_PARAMS } from 'Controls-Lists-editors/_columnsEditor/constants';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { FolderEditor } from 'Controls-Lists-editors/_columnsEditor/editorClasses/folder';
import { ObjectType } from 'Meta/types';
import {
    BaseEditor,
    IEditingValue,
} from 'Controls-Lists-editors/_columnsEditor/editorClasses/base';
import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { IHeaderCell } from 'Controls/baseGrid';
import { ListSlice } from 'Controls/dataFactory';
import rk = require('i18n!Controls-Lists-editors');
import { showType } from 'Controls/toolbars';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import { ItemsEntity } from 'Controls/dragnDrop';

interface IEmptyFolderItem extends ITreeControlItem {
    headerOptions?: IHeaderCell;
}

interface ISubTreeEditorContentProps {
    onChange: (newValue: IEditingValue) => void;
    treeItems: ITreeControlItem[];
    unusedColumns: IHeaderCell[];
    emptyFolders: IEmptyFolderItem[];
    subRootKey: number | string;
}

export interface ISubTreeProps extends ISubTreeEditorContentProps {
    loadData: Record;
    loadConfig: Record;
}

function getSelectionPopupConfig(items: ITreeControlItem[]) {
    return {
        columnsList: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new ExpandedSource({
                    keyProperty: 'key',
                    data: items,
                }),
                multiSelectVisibility: 'visible',
                nodeProperty: 'type',
                keyProperty: 'key',
                parentProperty: 'parent',
                expandedItems: [null],
                selectedKeys: [],
                searchParam: 'title',
            },
        },
    };
}

function getFolderItems(
    items: ITreeControlItem[],
    subRootKey: number | string,
    emptyFolders?: IEmptyFolderItem[]
): ITreeControlItem[] {
    const result: ITreeControlItem[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.hasChild) {
            result.push({
                ...item,
            });
        }
    }
    if (emptyFolders) {
        for (let i = 0; i < emptyFolders.length; i++) {
            result.push({
                ...emptyFolders[i],
                parent: subRootKey,
            });
        }
    }
    return result;
}
function getItemActions() {
    return [
        {
            id: 'move',
            icon: 'icon-Move',
            iconStyle: 'secondary',
            tooltip: rk('Переместить в папку'),
            showType: showType.TOOLBAR,
        },
        {
            id: 'delete',
            icon: 'icon-Erase',
            iconStyle: 'danger',
            tooltip: rk('Удалить'),
            showType: showType.TOOLBAR,
        },
    ];
}

function deleteEmptyFolder(folder: IEmptyFolderItem, emptyFolders: IEmptyFolderItem[]) {
    let newEmptyFolders = [...emptyFolders];
    const emptyFolderIdx = emptyFolders.findIndex((emptyFolder: IEmptyFolderItem) => {
        return emptyFolder.key === folder.key;
    });
    if (emptyFolderIdx !== -1) {
        newEmptyFolders = [];
        for (let i = 0; i < emptyFolders.length; i++) {
            if (i !== emptyFolderIdx) {
                newEmptyFolders.push(emptyFolders[i]);
            }
        }
    }
    return newEmptyFolders;
}

function openEmptyFolderEditor(
    openerElement: HTMLElement,
    editor: BaseEditor,
    onChange: (newValue: IEditingValue) => void
) {
    const opener = new ObjectEditorOpener();
    opener.open({
        metaType: ObjectType.properties(editor.getMetaType()),
        value: editor.getValue(),
        onChange,
        popupOptions: {
            direction: { vertical: 'center', horizontal: 'center' },
            closeOnOutsideClick: true,
            opener: openerElement,
            className: 'Controls-Lists-editors_columnsEditor_SubTree__add-folder-editor',
        },
        refresh: false,
        autoSave: true,
    });
}

export function Content(props: ISubTreeEditorContentProps) {
    const { onChange, LayoutComponent, treeItems, unusedColumns, subRootKey } = props;
    const columns = React.useRef([{ displayProperty: 'title' }]);
    const slice = useSlice('subTree');
    const contentRef = React.useRef(null);
    const treeGridRef = React.useRef(null);
    const [emptyFolders, setEmptyFolders] = React.useState<IEmptyFolderItem[]>(
        props.emptyFolders.map((folder, idx) => {
            return { ...folder, key: `empty_${idx}`, parent: subRootKey };
        })
    );
    React.useEffect(() => {
        let isMounted = true;
        const records = new RecordSet({
            rawData: emptyFolders,
        });
        const promise = slice.source.update(records);
        promise.then(() => {
            if (isMounted) {
                slice.reload();
            }
        });
        return () => {
            isMounted = false;
        };
    }, [emptyFolders, slice]);
    const selectionItems = React.useMemo(() => {
        const editingItems: ITreeControlItem[] = [];
        const subRootItem = treeItems.find((item: ITreeControlItem) => {
            return item.key === subRootKey;
        });
        const highestAncestor = getHighestAncestor(subRootItem.node);
        // Выделить элементы соответствующие колонкам и папкам, которые есть в таблице, но не соединены "родственными" связями с редактируемой папкой
        for (let i = 0; i < treeItems.length; i++) {
            const node: INode = treeItems[i].node;
            const isNested = findNode(
                highestAncestor,
                node.startColumn,
                node.endColumn,
                node.startRow,
                node.endRow
            );
            if (!isNested) {
                editingItems.push({ ...treeItems[i] });
            }
        }
        const unusedItems: ITreeControlItem[] = unusedColumns?.map((elem, elemIdx) => {
            return {
                key: editingItems.length + elemIdx,
                title: elem.header.caption,
                type: null,
                hasChild: false,
                parent: null,
                status: rk('Еще можно добавить'),
            };
        });
        return [...editingItems, ...unusedItems];
    }, [treeItems, unusedColumns, subRootKey]);
    const folders = React.useMemo(() => {
        return getFolderItems(treeItems, subRootKey, emptyFolders);
    }, [treeItems, emptyFolders, subRootKey]);
    const foldersSource = React.useMemo(() => {
        return new ExpandedSource({
            keyProperty: 'key',
            data: folders,
        });
    }, [folders]);
    const movingItem = React.useRef<ITreeControlItem | IEmptyFolderItem | undefined>();
    const onActionClick = React.useCallback(
        (action: IItemAction, item: RecordSet) => {
            const data: ITreeControlItem = item.getRawData();
            if (action.id === 'delete') {
                if (data.node === undefined) {
                    let folderToDelete: IEmptyFolderItem;
                    for (let i = 0; i < emptyFolders.length; i++) {
                        if (emptyFolders[i].key === data.key) {
                            folderToDelete = emptyFolders[i];
                        }
                    }
                    const newEmptyFolders = emptyFolders.filter((folder) => {
                        return folder.key !== data.key;
                    });
                    setEmptyFolders(newEmptyFolders);
                    slice.source.destroy(folderToDelete.key).then(() => {
                        slice.reload();
                    });
                } else {
                    onChange({
                        action: action.id,
                        items: data,
                        savedOptions: {
                            emptyFolders,
                        },
                    });
                }
            } else if (action.id === 'move') {
                treeGridRef.current.moveItemsWithDialog({ selected: [0], excluded: [] });
                movingItem.current = data;
            }
        },
        [onChange, emptyFolders, slice]
    );
    const onAddButtonClick = React.useCallback(async () => {
        if (selectionItems.length > 0) {
            const config = getSelectionPopupConfig(selectionItems);
            const data = await Loader.load(config);
            const dialog = new StackOpener();
            dialog.open({
                template: 'Controls-Lists-editors/columnsEditor:SelectionPopupRender',
                templateOptions: {
                    loadResults: data,
                    dataConfig: config,
                    showSelector: false,
                },
                eventHandlers: {
                    onResult: (selectedKeys: number[]) => {
                        const selectedItems: ITreeControlItem[] = [];
                        for (let i = 0; i < selectedKeys.length; i++) {
                            const key = selectedKeys[i];
                            const selectedItem: ITreeControlItem = selectionItems.find(
                                (item: ITreeControlItem) => item.key === key
                            );
                            if (selectedItem) {
                                if (!selectedItem.node) {
                                    const columnData =
                                        unusedColumns[
                                            key - (selectionItems.length - unusedColumns.length)
                                        ];
                                    selectedItem.node = {
                                        parent: null,
                                        children: [],
                                        selected: false,
                                        startColumn: columnData.header.startColumn,
                                        endColumn: columnData.header.endColumn,
                                        startRow: columnData.header.startRow,
                                        endRow: columnData.header.endRow,
                                        header: columnData.header,
                                        column: columnData.column,
                                    };
                                }
                                selectedItems.push({ ...selectedItem });
                            }
                        }
                        onChange({
                            action: 'add',
                            items: selectedItems,
                            savedOptions: {
                                emptyFolders,
                            },
                        });
                    },
                },
                closeOnOutsideClick: true,
                opener: contentRef.current,
            });
        }
    }, [selectionItems, emptyFolders, unusedColumns, onChange]);
    const onItemMove = React.useCallback(
        (targetData: RecordSet | null, position: LOCAL_MOVE_POSITION = 'on') => {
            let newEmptyFolders = emptyFolders;
            const targetItem = targetData === null ? targetData : targetData.getRawData();
            let shouldUpdateEditor = true;
            for (let i = 0; i < newEmptyFolders.length; i++) {
                const emptyFolder = newEmptyFolders[i];
                if (movingItem.current.key === emptyFolder.key) {
                    shouldUpdateEditor = false;
                    break;
                }
            }
            if (targetItem !== null && shouldUpdateEditor && position === 'on') {
                newEmptyFolders = deleteEmptyFolder(targetItem, newEmptyFolders);
                setEmptyFolders(newEmptyFolders);
            }
            if (shouldUpdateEditor) {
                onChange({
                    action: 'move',
                    items: [movingItem.current, targetItem],
                    position,
                    savedOptions: {
                        emptyFolders: newEmptyFolders,
                    },
                });
            } else {
                const record = new Record({
                    rawData: {
                        ...movingItem.current,
                        parent: targetItem.key,
                    },
                });
                slice.source.update(record).then(() => {
                    slice.reload();
                });
            }

            movingItem.current = undefined;
        },
        [onChange, emptyFolders, slice]
    );
    const onEmptyFolderChange = React.useCallback(
        (
            emptyFolderItemIdx: number,
            emptyFolders: IEmptyFolderItem[],
            editor: BaseEditor,
            slice: ListSlice,
            currentValue: IMarkupValue
        ) => {
            return (newValue: IEditingValue) => {
                const updatedValue: IMarkupValue = editor.updateValue(currentValue, newValue);
                const emptyFolderItem = { ...emptyFolders[emptyFolderItemIdx] };
                emptyFolderItem.headerOptions = {
                    caption: updatedValue.caption,
                    whiteSpace: updatedValue.whiteSpace,
                    align: updatedValue.align,
                };
                emptyFolderItem.title = updatedValue.caption;
                const newEmptyFolders = [...emptyFolders];
                newEmptyFolders[emptyFolderItemIdx] = { ...emptyFolderItem };
                setEmptyFolders(newEmptyFolders);
            };
        },
        []
    );
    const onAddFolderClick = React.useCallback(() => {
        const emptyFolder: IEmptyFolderItem = {
            key: `empty_${emptyFolders.length}`,
            title: FOLDER_DEFAULT_PARAMS.caption,
            type: true,
            parent: subRootKey,
            hasChild: false,
        };
        const newEmptyFolders = [...emptyFolders];
        newEmptyFolders.push(emptyFolder);
        setEmptyFolders(newEmptyFolders);
        const idx = newEmptyFolders.length - 1;
        const defaultValue = {
            caption: FOLDER_DEFAULT_PARAMS.caption,
            align: FOLDER_DEFAULT_PARAMS.align,
            whiteSpace: FOLDER_DEFAULT_PARAMS.whiteSpace,
        };
        const editor = new FolderEditor(defaultValue);
        openEmptyFolderEditor(
            contentRef.current,
            editor,
            onEmptyFolderChange(idx, newEmptyFolders, editor, slice, defaultValue)
        );
    }, [slice, emptyFolders, onEmptyFolderChange, subRootKey]);
    const onDragEnd = React.useCallback(
        (entity: ItemsEntity, target: RecordSet, position: LOCAL_MOVE_POSITION) => {
            const entityItemKey = entity.getItems().pop();
            movingItem.current = treeItems.find((item: ITreeControlItem) => {
                return item.key === entityItemKey;
            });
            onItemMove(target, position);
        },
        [onItemMove, treeItems]
    );
    const moveDialogTemplate = React.useMemo(() => {
        return {
            templateName: 'Controls/moverDialog:Template',
            templateOptions: {
                keyProperty: 'key',
                rootVisible: true,
                rootTitle: rk('Вне папок'),
                parentProperty: 'parent',
                nodeProperty: 'type',
                headingCaption: rk('Куда переместить'),
                searchParam: 'title',
                source: foldersSource,
                expandedItems: [null],
                eventHandlers: {
                    onResult: (data: RecordSet | null) => {
                        onItemMove(data);
                    },
                },
            },
        };
    }, [onItemMove, foldersSource]);
    // TODO Сейчас самостоятельно выводиться название группы и кнопки.
    //  Хотя это должно задаваться в конфиге группы. Будет поправлено после выполнения задачи https://online.sbis.ru/opendoc.html?guid=e1f51229-c74b-454d-94b3-6a6fe23e98fb&client=3
    return (
        <LayoutComponent>
            <div ref={contentRef}>
                <span className={'ControlsListsEditors_subTreeEditor_text'}>{rk('Колонки')}</span>
                <Button
                    icon={'icon-Addition'}
                    viewMode={'filled'}
                    tooltip={rk('Добавить колонки')}
                    buttonStyle={'pale'}
                    iconStyle={'default'}
                    onClick={onAddButtonClick}
                    inlineHeight={'m'}
                    readOnly={selectionItems.length === 0}
                    className={'ControlsListsEditors_subTreeEditor_add-columns_button'}
                    data-qa={'ControlsListsEditors_subTreeEditor_add-columns_button'}
                />
                <Button
                    icon={'icon-CreateFolder'}
                    viewMode={'link'}
                    tooltip={rk('Добавить папку')}
                    inlineHeight={'m'}
                    onClick={onAddFolderClick}
                    data-qa={'ControlsListsEditors_subTreeEditor_add-folder_button'}
                />
            </div>
            <div className={'ControlsListsEditors_subTreeEditor_view-wrapper'}>
                <ScrollContainer>
                    <View
                        storeId={'subTree'}
                        ref={treeGridRef}
                        columns={columns.current}
                        itemsDragNDrop={true}
                        itemActions={getItemActions()}
                        onActionClick={onActionClick}
                        onCustomdragEnd={onDragEnd}
                        customEvents={['onCustomdragEnd']}
                        moveDialogTemplate={moveDialogTemplate}
                    />
                </ScrollContainer>
            </div>
        </LayoutComponent>
    );
}
