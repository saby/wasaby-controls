/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import {
    ICellsSelectionModel,
    IGridSelectionModel,
    IRowSelectionModel,
    TColumnToRoot,
    TSelectionBounds,
} from './selectionModel/types';
import { TSelectionMap } from './shared/interface';
import {
    clone,
    convertGridSelectionToPlainRecord,
    createEmptySelection,
    getGridColumnCSSStyle,
    isEqualPlainSelections,
    resetHasSiblingToDirection,
    updateSiblingCellsSelection,
} from './selectionModel/helpers';
import { TColumnKey, TColumnKeys, TItemKey } from './shared/types';
import type { TreeGridCollection } from 'Controls/treeGrid';

export {
    SelectionModel,
    ISelectionModelProps,
    TSelectionMap as ISelection,
    ICellsSelectionModel,
    IRowSelectionModel,
    TSelectionBounds,
};

interface ISelectionModelProps {
    columns: TColumnKeys;
    // TODO: Переделать на норм, убрать реф.
    collectionRef: React.MutableRefObject<TreeGridCollection>;
    selection?: TSelectionMap;
}

type TToggleSelectionVisibilityArgsVariants = {
    ALL: [startItemKey: undefined, startColumnKey: undefined, isHidden: boolean];
    PARTIAL: [startItemKey: TItemKey, startColumnKey: TColumnKey, isHidden: boolean];
};
type TToggleSelectionVisibilityArgs =
    TToggleSelectionVisibilityArgsVariants[keyof TToggleSelectionVisibilityArgsVariants];

class SelectionModel {
    private _props: ISelectionModelProps;

    private _selection: IGridSelectionModel;
    private _plainSelection: TSelectionMap;

    // TODO: Вынести в класс и общаться как с сущностью.
    private _columnsToRoot: TColumnToRoot;

    constructor(props: ISelectionModelProps) {
        this._props = props;

        // TODO из опций
        this._selection = {};
        this._columnsToRoot = {};
        this._plainSelection = {};
        this._updateSelectionGridStyle = this._updateSelectionGridStyle.bind(this);

        if (this._props.selection) {
            this._changeSelection(this._plainSelection, this._props.selection);
        }
    }

    destroy() {
        this._resetSelection();
        this._props = undefined;
    }

    updateColumns(columns: ISelectionModelProps['columns']) {
        this._props.columns = columns;
        const changedItems: Record<TItemKey, true> = {};

        Object.keys(this._selection).forEach((itemKey) => {
            const rowSelection = this._selection[itemKey];

            Object.keys(rowSelection).forEach((selectionKey) => {
                const gridColumnCSSStyle = getGridColumnCSSStyle(
                    rowSelection[selectionKey],
                    columns
                );

                if (
                    rowSelection[selectionKey].gridColumnStart !==
                        gridColumnCSSStyle.gridColumnStart ||
                    rowSelection[selectionKey].gridColumnEnd !== gridColumnCSSStyle.gridColumnEnd
                ) {
                    rowSelection[selectionKey].gridColumnStart = gridColumnCSSStyle.gridColumnStart;
                    rowSelection[selectionKey].gridColumnEnd = gridColumnCSSStyle.gridColumnEnd;

                    if (!changedItems[itemKey]) {
                        changedItems[itemKey] = true;
                    }
                }
            });
        });

        Object.keys(changedItems).forEach((itemKey) => {
            this._selection[itemKey] = { ...this._selection[itemKey] };
        });
    }

    updateSelection(selection: ISelectionModelProps['selection']): boolean {
        const current = convertGridSelectionToPlainRecord(this._selection);
        if (!isEqualPlainSelections(current, selection)) {
            this._changeSelection(current, selection);
            return true;
        }
        return false;
    }

    getSelection(): TSelectionMap {
        return this._plainSelection;
    }

    isEqualPlainSelections(selection: TSelectionMap): boolean {
        return isEqualPlainSelections(this._plainSelection, selection);
    }

    isSelected(itemKey: TItemKey, columnKey: TColumnKey): boolean {
        // Если для данной ячейки есть id выделения, то она выделена.
        return typeof this._getSelectionRootColumnKey(itemKey, columnKey) !== 'undefined';
    }

    getRowSelectionModel(itemKey: TItemKey): IRowSelectionModel {
        return this._selection[itemKey];
    }

    getCellsSelectionModel(itemKey: TItemKey, columnKey: TColumnKey): ICellsSelectionModel {
        const root = this._getSelectionRootColumnKey(itemKey, columnKey);
        return typeof root !== 'undefined' ? this._selection[itemKey][root] : undefined;
    }

    getBoundingSelectionKeys(itemKey: TItemKey, columnKey: TColumnKey): TSelectionBounds {
        const selection = this.getCellsSelectionModel(itemKey, columnKey);

        if (!selection) {
            // TODO: Расписать.
            throw Error('Так быть не может, это обработчик события');
        }

        const startColumnKey = selection.firstColumnKey;
        const endColumnKey = selection.lastColumnKey;
        const plainSelection: TSelectionMap = {};
        let startItemKey;
        let endItemKey;

        if (!selection.hasSiblingUp && !selection.hasSiblingDown) {
            startItemKey = itemKey;
            endItemKey = itemKey;
            plainSelection[itemKey] = [...selection.selectedKeys];
        } else {
            this._forEachSelections(itemKey, selection.rootKey, (_itemKey, _selection) => {
                if (typeof startItemKey === 'undefined') {
                    startItemKey = _itemKey;
                }
                endItemKey = _itemKey;
                if (!plainSelection[_itemKey]) {
                    plainSelection[_itemKey] = [];
                }
                plainSelection[_itemKey].push(..._selection.selectedKeys);
            });
        }

        return {
            startItemKey,
            endItemKey,
            startColumnKey,
            endColumnKey,
            plainSelection,
        };
    }

    toggleSelectionVisibility(
        ...[startItemKey, startColumnKey, isHidden]: TToggleSelectionVisibilityArgs
    ): void {
        const changedItems: Record<TItemKey, true> = {};

        const change = (itemKey, selection) => {
            if (selection.isHidden !== isHidden) {
                selection.isHidden = isHidden;
                if (!changedItems[itemKey]) {
                    changedItems[itemKey] = true;
                }
            }
        };

        if (typeof startItemKey === 'undefined' && typeof startColumnKey === 'undefined') {
            Object.keys(this._selection).forEach((itemKey) => {
                Object.keys(this._selection[itemKey]).forEach((selectionRootCellKey) => {
                    change(itemKey, this._selection[itemKey][selectionRootCellKey]);
                });
            });
        } else {
            this._forEachSelections(startItemKey, startColumnKey, (itemKey, selection) => {
                change(itemKey, selection);
            });
        }

        Object.keys(changedItems).forEach((itemKey) => {
            this._selection[itemKey] = { ...this._selection[itemKey] };
        });
    }

    private _changeSelection(oldSelection: TSelectionMap, newSelection: TSelectionMap): void {
        const diff = this._getSelectionDiff(oldSelection, newSelection);

        const changedItemsKeys: TItemKey[] = [];
        const changedSelections: ICellsSelectionModel[] = [];

        const removedItemsKeys = Object.keys(diff.removed);
        removedItemsKeys.forEach((itemKey) => {
            diff.removed[itemKey].forEach((columnKey) => {
                const changed = this._handleRemoveFromSelection(itemKey, columnKey);
                changed.forEach((c) => {
                    if (changedSelections.indexOf(c) === -1) {
                        changedSelections.push(c);
                    }
                });
            });
        });
        changedItemsKeys.push(...removedItemsKeys);

        const addedItemsKeys = Object.keys(diff.added);
        addedItemsKeys.forEach((itemKey) => {
            diff.added[itemKey].forEach((columnKey) => {
                const changed = this._handleAddToSelection(itemKey, columnKey);
                changed.forEach((c) => {
                    if (changedSelections.indexOf(c) === -1) {
                        changedSelections.push(c);
                    }
                });
            });
        });
        changedItemsKeys.push(...addedItemsKeys);

        changedSelections.forEach(this._updateSelectionGridStyle);

        changedItemsKeys
            .filter((key, index) => changedItemsKeys.lastIndexOf(key) === index)
            .forEach((key) => {
                this._updateSibling(key);
            });

        this._plainSelection = convertGridSelectionToPlainRecord(this._selection);
    }

    private _resetSelection() {
        this._selection = {};
        this._columnsToRoot = {};
        this._plainSelection = {};
    }

    private _getSelectionRootColumnKey(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): TColumnKey | undefined {
        return this._columnsToRoot[itemKey]?.[columnKey];
    }

    private _getCollection(): TreeGridCollection {
        return this._props.collectionRef.current;
    }

    private _updateSibling(itemKey: TItemKey): void {
        const item = this._getCollection().getItemBySourceKey(itemKey);

        const prevItem = item && this._getCollection().getPrevious(item);
        const nextItem = item && this._getCollection().getNext(item);

        const prevItemKey = prevItem && prevItem.key;
        const nextItemKey = nextItem && nextItem.key;

        const rowSelection = this._selection[itemKey];
        const prevSiblingRowSelection = this._selection[prevItemKey];
        const nextSiblingRowSelection = this._selection[nextItemKey];

        if (rowSelection) {
            resetHasSiblingToDirection(rowSelection, 'both');
        }

        if (!prevSiblingRowSelection && !nextSiblingRowSelection) {
            return;
        }

        let isPrevChanged = false;
        let isNextChanged = false;

        if (prevSiblingRowSelection) {
            isPrevChanged = resetHasSiblingToDirection(prevSiblingRowSelection, 'down');
        }

        if (nextSiblingRowSelection) {
            isNextChanged = resetHasSiblingToDirection(nextSiblingRowSelection, 'up');
        }

        if (rowSelection) {
            Object.keys(rowSelection).forEach((currentCellsSelectionRootKey) => {
                if (prevSiblingRowSelection) {
                    isPrevChanged =
                        updateSiblingCellsSelection(
                            this._selection,
                            itemKey,
                            currentCellsSelectionRootKey as unknown as TColumnKey,
                            prevItemKey,
                            'up'
                        ) || isPrevChanged;
                }

                if (nextSiblingRowSelection) {
                    isNextChanged =
                        updateSiblingCellsSelection(
                            this._selection,
                            itemKey,
                            currentCellsSelectionRootKey as unknown as TColumnKey,
                            nextItemKey,
                            'down'
                        ) || isNextChanged;
                }
            });
        }

        if (rowSelection) {
            this._selection[itemKey] = {
                ...this._selection[itemKey],
            };
        }

        if (isPrevChanged) {
            this._selection[prevItemKey] = {
                ...this._selection[prevItemKey],
            };
        }

        if (isNextChanged) {
            this._selection[nextItemKey] = {
                ...this._selection[nextItemKey],
            };
        }
    }

    private _updateSelectionGridStyle(selection: ICellsSelectionModel) {
        const gridColumnCSSStyle = getGridColumnCSSStyle(selection, this._props.columns);

        selection.gridColumnStart = gridColumnCSSStyle.gridColumnStart;
        selection.gridColumnEnd = gridColumnCSSStyle.gridColumnEnd;
    }

    private _getSelectionDiff(
        oldSelection: TSelectionMap,
        newSelection: TSelectionMap
    ): {
        added: TSelectionMap;
        removed: TSelectionMap;
    } {
        const result = {
            added: {},
            removed: {},
        };

        const oldSelectionItemsKeys = Object.keys(oldSelection);
        const newSelectionItemsKeys = Object.keys(newSelection);

        const allKeys = [
            ...oldSelectionItemsKeys,
            ...newSelectionItemsKeys.filter((k) => oldSelectionItemsKeys.indexOf(k) === -1),
        ];

        allKeys.forEach((itemKey) => {
            // Удалили строку
            if (oldSelection[itemKey] && !newSelection[itemKey]) {
                result.removed[itemKey] = [...oldSelection[itemKey]];
            }
            // Добавили строку
            else if (!oldSelection[itemKey] && newSelection[itemKey]) {
                const added = newSelection[itemKey].filter(
                    (columnKey) => !this.isSelected(itemKey, columnKey)
                );

                if (added.length) {
                    result.added[itemKey] = added;
                }
            }
            // Изменили строку
            else {
                const added = newSelection[itemKey].filter(
                    (columnKey) =>
                        oldSelection[itemKey].indexOf(columnKey) === -1 &&
                        !this.isSelected(itemKey, columnKey)
                );
                const removed = oldSelection[itemKey].filter(
                    (columnKey) => newSelection[itemKey].indexOf(columnKey) === -1
                );

                if (added.length) {
                    result.added[itemKey] = added;
                }
                if (removed.length) {
                    result.removed[itemKey] = removed;
                }
            }
        });

        return result;
    }

    // region ADD/REMOVE METHODS
    private _handleRemoveFromSelection(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): ICellsSelectionModel[] {
        const selection = this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];

        if (selection.selectedKeys.length === 1) {
            if (Object.keys(this._selection[itemKey]).length === 1) {
                this._deleteRowSelection(itemKey);
            } else {
                this._deleteSelectionWithOneKey(itemKey, columnKey);
            }
            return [];
        } else if (selection.lastColumnKey === columnKey) {
            return [this._popFromSelection(itemKey, columnKey)];
        } else if (selection.firstColumnKey === columnKey) {
            return [this._unshiftFromSelection(itemKey, columnKey)];
        } else {
            return this._splitSelection(itemKey, columnKey);
        }
    }

    private _handleAddToSelection(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): ICellsSelectionModel[] {
        let joinSelection: ICellsSelectionModel;

        const columnIndex = this._props.columns.indexOf(columnKey);

        // Текущий item
        const prevColumnKey = this._props.columns[columnIndex - 1];
        const nextColumnKey = this._props.columns[columnIndex + 1];

        if (this.isSelected(itemKey, prevColumnKey)) {
            const selectionRootColumnKey = this._columnsToRoot[itemKey][prevColumnKey];
            // Меняем ссылку на строку и на выделение ячеек с которой будем объединять ячейку.
            // Ссылки остальных выделений в строке остаются теми-же.
            this._selection[itemKey] = {
                ...this._selection[itemKey],
                [selectionRootColumnKey]: { ...this._selection[itemKey][selectionRootColumnKey] },
            };
            joinSelection = this._selection[itemKey][selectionRootColumnKey];

            joinSelection.selectedKeys.push(columnKey);
            joinSelection.lastColumnKey = columnKey;
            this._columnsToRoot[itemKey][columnKey] = selectionRootColumnKey;
        }

        if (this.isSelected(itemKey, nextColumnKey)) {
            const selectionRootColumnKey = this._columnsToRoot[itemKey][nextColumnKey];

            if (joinSelection) {
                const nextSelection = this._selection[itemKey][selectionRootColumnKey];

                // Мы уже объединяем с существующим выделением, ссылка на него новое.
                // Правое выделение будет удалено.
                joinSelection.selectedKeys.push(...nextSelection.selectedKeys);
                joinSelection.lastColumnKey = nextSelection.lastColumnKey;
                nextSelection.selectedKeys.forEach((selectedKey) => {
                    this._columnsToRoot[itemKey][selectedKey] = joinSelection.rootKey;
                });
                delete this._selection[itemKey][selectionRootColumnKey];
            } else {
                // Меняем ссылку на строку и на выделение ячеек с которой будем объединять ячейку.
                // Ссылки остальных выделений в строке остаются теми-же.
                this._selection[itemKey] = {
                    ...this._selection[itemKey],
                    [selectionRootColumnKey]: {
                        ...this._selection[itemKey][selectionRootColumnKey],
                    },
                };
                joinSelection = this._selection[itemKey][selectionRootColumnKey];

                joinSelection.selectedKeys.unshift(columnKey);
                joinSelection.firstColumnKey = columnKey;
                this._columnsToRoot[itemKey][columnKey] = selectionRootColumnKey;
            }
        }

        if (!joinSelection) {
            joinSelection = createEmptySelection([columnKey]);
            // Меняем ссылку на строку и на выделение ячеек в которую будем добавлять ячейку.
            // Ссылки остальных выделений в строке остаются теми-же.
            this._selection[itemKey] = { ...(this._selection[itemKey] || {}) };
            if (!this._columnsToRoot[itemKey]) {
                this._columnsToRoot[itemKey] = {};
            }
            this._selection[itemKey][columnKey] = joinSelection;
            this._columnsToRoot[itemKey][columnKey] = columnKey;
        }

        return [joinSelection];
    }

    private _deleteRowSelection(itemKey: TItemKey): void {
        Object.keys(this._selection[itemKey]).forEach((key) => {
            this._selection[itemKey][key].selectedKeys.forEach((cellKey) => {
                delete this._columnsToRoot[itemKey][cellKey];
            });
            delete this._selection[itemKey][key];
        });

        delete this._columnsToRoot[itemKey];
        delete this._selection[itemKey];
    }

    private _deleteSelectionWithOneKey(itemKey: TItemKey, columnKey: TColumnKey): void {
        const selection = this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];

        delete this._selection[itemKey][selection.rootKey];
        if (!Object.keys(this._selection[itemKey]).length) {
            delete this._selection[itemKey];
        }
        delete this._columnsToRoot[itemKey][selection.rootKey];
        if (!Object.keys(this._columnsToRoot[itemKey]).length) {
            delete this._columnsToRoot[itemKey];
        }
    }

    private _popFromSelection(itemKey: TItemKey, columnKey: TColumnKey): ICellsSelectionModel {
        return this._removeFromEdge(itemKey, columnKey, 'forward');
    }

    private _unshiftFromSelection(itemKey: TItemKey, columnKey: TColumnKey): ICellsSelectionModel {
        return this._removeFromEdge(itemKey, columnKey, 'backward');
    }

    private _removeFromEdge(
        itemKey: TItemKey,
        columnKey: TColumnKey,
        edge: 'backward' | 'forward'
    ): ICellsSelectionModel {
        const selection = this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];

        const affectedSelection: ICellsSelectionModel = createEmptySelection(
            edge === 'backward'
                ? selection.selectedKeys.slice(1)
                : selection.selectedKeys.slice(0, selection.selectedKeys.length - 1)
        );

        affectedSelection.selectedKeys.forEach((k) => {
            this._columnsToRoot[itemKey][k] = affectedSelection.rootKey;
        });

        delete this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];
        delete this._columnsToRoot[itemKey][columnKey];

        // Меняем ссылку на строку и на выделение ячеек из которой удалили ячейку.
        // Ссылки остальных выделений в строке остаются теми-же.
        this._selection[itemKey] = {
            ...this._selection[itemKey],
            [affectedSelection.rootKey]: affectedSelection,
        };
        return affectedSelection;
    }

    private _splitSelection(
        itemKey: TItemKey,
        columnKey: TColumnKey
    ): [leftSelection: ICellsSelectionModel, rightSelection: ICellsSelectionModel] {
        const selection = this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];

        const leftSelection = createEmptySelection(
            selection.selectedKeys.slice(0, selection.selectedKeys.indexOf(columnKey))
        );

        leftSelection.selectedKeys.forEach((k) => {
            this._columnsToRoot[itemKey][k] = leftSelection.rootKey;
        });

        const rightSelection = createEmptySelection(
            selection.selectedKeys.slice(selection.selectedKeys.indexOf(columnKey) + 1)
        );

        rightSelection.selectedKeys.forEach((k) => {
            this._columnsToRoot[itemKey][k] = rightSelection.rootKey;
        });

        delete this._selection[itemKey][this._columnsToRoot[itemKey][columnKey]];
        delete this._columnsToRoot[itemKey][columnKey];

        // Меняем ссылку на строку и на выделение ячеек из которой удалили ячейку.
        // Ссылки остальных выделений в строке остаются теми-же.
        this._selection[itemKey] = {
            ...this._selection[itemKey],
            [leftSelection.rootKey]: leftSelection,
            [rightSelection.rootKey]: rightSelection,
        };

        return [leftSelection, rightSelection];
    }

    // endregion

    // region Методы обхода выделения (_forEachSelections)
    private _forEachSelections(
        itemKey: TItemKey,
        columnKey: TColumnKey,
        cb: (itemKey: TItemKey, selection: ICellsSelectionModel) => void
    ): void {
        const selectionRootColumnKey = this._getSelectionRootColumnKey(itemKey, columnKey);
        const topSelections = this._getSelectionsInDirection(
            itemKey,
            selectionRootColumnKey,
            'up'
        ).reverse();
        const bottomSelections = this._getSelectionsInDirection(
            itemKey,
            selectionRootColumnKey,
            'down'
        );

        [
            ...topSelections,
            [itemKey, this._selection[itemKey][selectionRootColumnKey]],
            ...bottomSelections,
        ].forEach(([_itemKey, selection]) => {
            cb(_itemKey as TItemKey, selection as ICellsSelectionModel);
        });
    }

    private _getSelectionsInDirection(
        itemKey: TItemKey,
        selectionRootColumnKey: TColumnKey,
        direction: 'up' | 'down'
    ): [TItemKey, ICellsSelectionModel][] {
        const result: [TItemKey, ICellsSelectionModel][] = [];

        this._forEachRowSelectionFromCurrentToDirection(
            itemKey,
            selectionRootColumnKey,
            direction,
            (currentItemKey, currentSelectionRootColumnKey, currentSelection) => {
                if (currentItemKey !== itemKey) {
                    result.push([currentItemKey, currentSelection]);
                }
            }
        );

        return result;
    }

    private _forEachRowSelectionFromCurrentToDirection(
        itemKey: TItemKey,
        selectionRootColumnKey: TColumnKey,
        direction: 'up' | 'down',
        cb: (
            currentItemKey: TItemKey,
            currentSelectionRootColumnKey: TColumnKey,
            currentSelection: ICellsSelectionModel,
            breakCb: () => void
        ) => void
    ): void {
        const selectionFirstColumnKey =
            this._selection[itemKey][selectionRootColumnKey].firstColumnKey;
        const selectionLastColumnKey =
            this._selection[itemKey][selectionRootColumnKey].lastColumnKey;

        let currentItemKey = itemKey;
        let currentRootColumnKey;
        let isStopped = false;
        const breakCb = () => {
            isStopped = true;
        };

        do {
            currentRootColumnKey = Object.keys(this._selection[currentItemKey]).find((key) => {
                return (
                    this._selection[currentItemKey][key].firstColumnKey ===
                        selectionFirstColumnKey &&
                    this._selection[currentItemKey][key].lastColumnKey === selectionLastColumnKey
                );
            }) as unknown as TColumnKey;

            const currentSelection = this._selection[currentItemKey][
                currentRootColumnKey
            ] as ICellsSelectionModel;
            cb(currentItemKey, currentRootColumnKey, currentSelection, breakCb);
            currentItemKey = currentSelection[direction === 'up' ? 'prevItemKey' : 'nextItemKey'];
        } while (!isStopped && typeof currentItemKey !== 'undefined');
    }

    // endregion

    static clone(selection: TSelectionMap): TSelectionMap {
        return clone(selection);
    }

    static removeSelections(
        selection: TSelectionMap,
        partialSelection: TSelectionMap
    ): TSelectionMap {
        const resultSelection = SelectionModel.clone(selection);

        Object.keys(partialSelection).forEach((itemKey) => {
            partialSelection[itemKey].forEach((columnKey) => {
                if (resultSelection[itemKey]) {
                    const index = resultSelection[itemKey].indexOf(columnKey);
                    if (index !== -1) {
                        if (resultSelection[itemKey].length === 1) {
                            delete resultSelection[itemKey];
                        } else {
                            resultSelection[itemKey].splice(index, 1);
                        }
                    }
                }
            });
        });

        return resultSelection;
    }

    static mergeSelections(
        selection: TSelectionMap,
        partialSelection: TSelectionMap
    ): TSelectionMap {
        const resultSelection = SelectionModel.clone(selection);

        Object.keys(partialSelection).forEach((itemKey) => {
            partialSelection[itemKey].forEach((columnKey) => {
                if (!resultSelection[itemKey]) {
                    resultSelection[itemKey] = [columnKey];
                } else if (resultSelection[itemKey].indexOf(columnKey) === -1) {
                    resultSelection[itemKey].push(columnKey);
                }
            });
        });

        return resultSelection;
    }

    static mergeSelectionsWithToggle(
        selection: TSelectionMap,
        partialSelection: TSelectionMap
    ): TSelectionMap {
        const resultSelection = SelectionModel.clone(selection);

        Object.keys(partialSelection).forEach((itemKey) => {
            partialSelection[itemKey].forEach((columnKey) => {
                if (resultSelection[itemKey]) {
                    const index = resultSelection[itemKey].indexOf(columnKey);
                    if (index === -1) {
                        resultSelection[itemKey].push(columnKey);
                    } else {
                        if (resultSelection[itemKey].length === 1) {
                            delete resultSelection[itemKey];
                        } else {
                            resultSelection[itemKey].splice(index, 1);
                        }
                    }
                } else {
                    resultSelection[itemKey] = [columnKey];
                }
            });
        });

        return resultSelection;
    }

    static filterSelections(
        selection: TSelectionMap,
        filterCallback: (itemKey: TItemKey, columnKey: TColumnKey) => boolean
    ): TSelectionMap {
        const resultSelection = SelectionModel.clone(selection);

        Object.keys(selection).forEach((itemKey) => {
            selection[itemKey].forEach((columnKey) => {
                if (!filterCallback(itemKey, columnKey)) {
                    if (resultSelection[itemKey].length === 1) {
                        delete resultSelection[itemKey];
                    } else {
                        resultSelection[itemKey].splice(
                            resultSelection[itemKey].indexOf(columnKey),
                            1
                        );
                    }
                }
            });
        });

        return resultSelection;
    }
}
