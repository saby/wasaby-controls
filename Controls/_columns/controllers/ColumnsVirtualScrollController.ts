import { CrudEntityKey } from 'Types/source';

import {
    IDirectionNew,
    IEdgeItem,
    IListVirtualScrollControllerOptions,
    IScrollOnReset,
    IScrollMode,
    ICalcMode,
    ITriggerPosition,
    IAdditionalTriggersOffsets,
} from 'Controls/baseList';
import { GroupItem } from 'Controls/display';

import ColumnVirtualScrollController from 'Controls/_columns/controllers/ColumnVirtualScrollController';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import CollectionItem from 'Controls/_columns/display/CollectionItem';

export default class ColumnsVirtualScrollController {
    private _options: IListVirtualScrollControllerOptions;
    private _scrollOnReset: IScrollOnReset = null;
    private _scrollPosition: number = 0;

    private _columnControllers: Record<number, ColumnVirtualScrollController>;

    private _firstRenderedGroup: GroupItem;
    private _lastRenderedGroup: GroupItem;
    private _listContainer: HTMLElement;
    private _itemsContainer: HTMLElement;
    private _viewportSize: number;
    private _contentSize: number;

    private get _collection(): ColumnsCollection {
        return this._options.collection as unknown as ColumnsCollection;
    }

    constructor(options: IListVirtualScrollControllerOptions) {
        this._options = { ...options };

        this._handleColumnCountChanges = this._handleColumnCountChanges.bind(this);
        if (this._collection) {
            this._collection.subscribe('columnsCountChanged', this._handleColumnCountChanges);
            this.resetItems();
        }
    }

    // region HandleCollectionChanges
    resetItems(): void {
        if (this._columnControllers instanceof Object) {
            Object.values(this._columnControllers).forEach((it) => {
                return it.destroy();
            });
        }
        this._columnControllers = {};

        const pageSizeInColumn = this._options.virtualScrollConfig.pageSize
            ? Math.ceil(
                  this._options.virtualScrollConfig.pageSize / this._collection.getColumnsCount()
              )
            : undefined;
        for (let columnIndex = 0; columnIndex < this._collection.getColumnsCount(); columnIndex++) {
            this._columnControllers[columnIndex] = new ColumnVirtualScrollController({
                ...this._options,
                itemsContainer: this._itemsContainer,
                listContainer: this._listContainer,
                scrollPosition: this._scrollPosition,
                viewportSize: this._viewportSize,
                contentSize: this._contentSize,
                column: columnIndex,
                virtualScrollConfig: {
                    ...this._options.virtualScrollConfig,
                    pageSize: pageSizeInColumn,
                },
                doScrollUtil: () => {
                    return null;
                },
            });
        }

        if (this._scrollOnReset === 'reset' && !!this._scrollPosition) {
            this._options.doScrollUtil('top');
        }
    }

    addItems(position: number, count: number, scrollMode: IScrollMode, calcMode: ICalcMode): void {
        const addedItemsByColumns: Record<number, { count: number; position: number }> = {};

        const addedItems = this._collection.getItems().slice(position, position + count);
        addedItems.forEach((item) => {
            if (!item['[Controls/_columns/display/CollectionItem]']) {
                return;
            }

            const column = item.getColumn();
            if (addedItemsByColumns.hasOwnProperty(column)) {
                addedItemsByColumns[column].count++;
            } else {
                const itemCollectionIndex = this._collection.getIndex(item);
                addedItemsByColumns[column] = {
                    count: 1,
                    position: this._collection.getIndexInColumnByIndex(itemCollectionIndex),
                };
            }
        });

        Object.entries(addedItemsByColumns).forEach((entry) => {
            const column = Number(entry[0]);
            this._columnControllers[column].addItems(
                entry[1].position,
                entry[1].count,
                scrollMode,
                calcMode
            );
        });
    }

    moveItems(
        addPosition: number,
        addCount: number,
        removePosition: number,
        removeCount: number
    ): void {
        const firstMovedItem = this._collection.at(addPosition);
        const column = firstMovedItem.getColumn();
        const prevColumn = firstMovedItem.getPrevColumn();
        if (prevColumn !== undefined && column !== prevColumn) {
            const movedItemIndex = this._collection.getIndexInColumnByIndex(addPosition);

            this._columnControllers[column].addItems(movedItemIndex, addCount, 'fixed', 'shift');
            this._columnControllers[prevColumn].removeItems(
                movedItemIndex,
                Array(removeCount),
                'fixed'
            );
        }
    }

    removeItems(position: number, removedItems: CollectionItem[], scrollMode: IScrollMode): void {
        const columnCounts = this._collection.getColumnsCount();
        const isDragging =
            this._collection.isDragging() ||
            removedItems.some((it) => {
                return it.isDragged();
            });
        const removedItemsByColumns = [];
        for (let col = 0; col < columnCounts; col++) {
            removedItemsByColumns.push(
                removedItems.filter((item) => {
                    return item.getColumn() === col;
                })
            );
        }

        removedItemsByColumns.forEach((removedItemsInColumn, column) => {
            const firstRemovedItem = removedItemsInColumn[0];
            const positionInColumn = this._collection.getIndexInColumnByIndex(
                position,
                firstRemovedItem
            );

            const columnsSnapshot = this._collection.getColumnsSnapshot();
            let columnSnapshot = columnsSnapshot.columns[column] || [];
            const itemsCountInColumn = columnSnapshot.length;
            let columnRange = this._collection.getColumnRange(column);

            // Записи не перепрыгнули между колонками, значит пересчитываем диапазон в column
            if (itemsCountInColumn !== columnRange.endIndex || isDragging) {
                this._columnControllers[column].removeItems(
                    positionInColumn,
                    removedItemsInColumn,
                    scrollMode
                );
            } else {
                // Записи при удалении перепрыгнули в другие колонки,
                // значит нужно найти колонку в которой уменьшилось кол-во записей
                let newColumn = column;
                do {
                    newColumn++;
                    columnSnapshot = columnsSnapshot.columns[newColumn] || [];
                    columnRange = this._collection.getColumnRange(newColumn);
                    if (columnSnapshot.length !== columnRange.endIndex) {
                        break;
                    }
                } while (newColumn < columnCounts);

                // Если нашли колонку из которой переместились записи, то из нее и удаляем запись,
                // если такой колонки не нашли, то удаляем запись в изначальной колонке
                if (newColumn !== column && newColumn < columnCounts) {
                    this._columnControllers[newColumn].removeItems(
                        positionInColumn,
                        removedItems,
                        scrollMode
                    );
                } else {
                    this._columnControllers[column].removeItems(
                        positionInColumn,
                        removedItems,
                        scrollMode
                    );
                }
            }
        });
    }
    // endregion HandleCollectionChanges

    // region LiveHooks
    endBeforeMountListControl(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.endBeforeMountListControl();
        });
    }
    afterMountListControl(): void {
        this._firstRenderedGroup = this._collection.getGroups().find((it) => {
            return this._collection.isFirstGroup(it);
        });
        this._lastRenderedGroup = this._collection.getGroups().find((it) => {
            return this._collection.isLastGroup(it);
        });
        Object.values(this._columnControllers).forEach((it) => {
            return it.afterMountListControl();
        });
    }
    endBeforeUpdateListControl(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.endBeforeUpdateListControl();
        });
    }
    beforeRenderListControl(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.beforeRenderListControl();
        });
    }
    afterRenderListControl(): void {
        // Верхний триггер отрисовываем в первой группе, поэтому если первая группа изменилась, то
        // нужно обновить триггеры.
        const [firstRenderedGroup, lastRenderedGroups] = this._collection
            .getGroups()
            .filter((it) => {
                return this._collection.isFirstGroup(it) || this._collection.isLastGroup(it);
            });
        if (
            this._firstRenderedGroup !== firstRenderedGroup ||
            this._lastRenderedGroup !== lastRenderedGroups
        ) {
            this._firstRenderedGroup = firstRenderedGroup;
            this._lastRenderedGroup = lastRenderedGroups;
            Object.values(this._columnControllers).forEach((it) => {
                return it.updateTriggers();
            });
        }
        Object.values(this._columnControllers).forEach((it) => {
            return it.afterRenderListControl();
        });
    }
    // endregion LiveHooks

    // region HandleEvents
    virtualScrollPositionChange(position: number, applyScrollPositionCallback: () => void): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.virtualScrollPositionChange(position, applyScrollPositionCallback);
        });
    }
    stickyFixedChanged(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.stickyFixedChanged();
        });
    }
    scrollPositionChange(position: number): void {
        if (this._collection.getMinBackwardColumnPlaceholder() > position) {
            this.virtualScrollPositionChange(position, () => {
                return this.scrollPositionChange(position);
            });
        } else {
            this._scrollPosition = position;
            Object.values(this._columnControllers).forEach((it) => {
                return it.scrollPositionChange(position);
            });
        }
    }
    contentResized(contentSize: number): void {
        this._contentSize = contentSize;
        Object.values(this._columnControllers).forEach((it) => {
            return it.contentResized(contentSize);
        });
    }
    viewportResized(viewportSize: number): void {
        this._viewportSize = viewportSize;
        Object.values(this._columnControllers).forEach((it) => {
            return it.viewportResized(viewportSize);
        });
    }
    scrollResized(size: number): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.scrollResized(size);
        });
    }
    // endregion HandleEvents

    // region ScrollTo
    scrollToItem(
        key: CrudEntityKey,
        position?: string,
        force?: boolean,
        selfScroll?: boolean
    ): Promise<void> {
        const controllerWithElement = Object.values(this._columnControllers).find((it) => {
            return it.getElement(key);
        });
        if (!controllerWithElement) {
            return Promise.resolve();
        }

        return controllerWithElement.scrollToItem(key, position, force, selfScroll);
    }
    isScrollToItemInProgress(): boolean {
        return !!Object.values(this._columnControllers).find((it) => {
            return it.isScrollToItemInProgress();
        });
    }
    scrollToPage(direction: IDirectionNew): Promise<CrudEntityKey> {
        const promises: Promise<CrudEntityKey>[] = [];
        Object.values(this._columnControllers).forEach((it) => {
            promises.push(it.scrollToPage(direction));
        });
        return Promise.all(promises).then((values) => {
            return values[0];
        });
    }
    scrollToEdge(edge: IDirectionNew): Promise<void | CrudEntityKey> {
        const promises: Promise<CrudEntityKey>[] = [];
        Object.values(this._columnControllers).forEach((it) => {
            promises.push(it.scrollToPage(edge));
        });
        return Promise.all(promises).then((values) => {
            return values[0];
        });
    }
    // endregion ScrollTo

    // region SetGet
    setCollection(collection: ColumnsCollection): void {
        if (this._collection && !this._collection.isDestroyed()) {
            this._collection.unsubscribe('columnsCountChanged', this._handleColumnCountChanges);
        }
        this._options.collection = collection;
        if (this._collection) {
            this._collection.subscribe('columnsCountChanged', this._handleColumnCountChanges);
        }
        this.resetItems();
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        this._itemsContainer = itemsContainer;
        Object.values(this._columnControllers).forEach((columnController) => {
            return columnController.setItemsContainer(itemsContainer);
        });
    }

    setItemsQuerySelector(newItemsQuerySelector: string): void {
        Object.values(this._columnControllers).forEach((it) => {
            it.setItemsQuerySelector(newItemsQuerySelector);
        });
    }

    setListContainer(listContainer: HTMLElement): void {
        this._listContainer = listContainer;
        Object.values(this._columnControllers).forEach((columnController) => {
            return columnController.setListContainer(listContainer);
        });
    }

    getElement(key: CrudEntityKey): HTMLElement {
        const controllerWithElement = Object.values(this._columnControllers).find((it) => {
            return it.getElement(key);
        });
        if (controllerWithElement) {
            return controllerWithElement.getElement(key);
        }

        return null;
    }

    setScrollBehaviourOnReset(scrollBehaviourOnReset: IScrollOnReset): void {
        if (scrollBehaviourOnReset === 'reset') {
            // Сбрасываем скролл, только если до этого не сказали восстановить или сохранить скролл
            if (!this._scrollOnReset) {
                this._scrollOnReset = 'reset';
            }
        } else {
            this._scrollOnReset = scrollBehaviourOnReset;
        }
        Object.values(this._columnControllers).forEach((it) => {
            return it.setScrollBehaviourOnReset(scrollBehaviourOnReset);
        });
    }

    setBackwardTriggerVisibility(visible: boolean): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.setBackwardTriggerVisibility(visible);
        });
    }
    setForwardTriggerVisibility(visible: boolean): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.setForwardTriggerVisibility(visible);
        });
    }
    setBackwardTriggerPosition(position: ITriggerPosition): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.setBackwardTriggerPosition(position);
        });
    }
    setForwardTriggerPosition(position: ITriggerPosition): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.setForwardTriggerPosition(position);
        });
    }
    setAdditionalTriggersOffsets(additionalTriggersOffsets: IAdditionalTriggersOffsets): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.setAdditionalTriggersOffsets(additionalTriggersOffsets);
        });
    }
    // endregion SetGet

    // region NotImplemented
    setActiveElementKey(activeElementKey: CrudEntityKey): void {
        throw new Error('Method not implemented.');
    }
    setRenderedItems(renderedItems: CrudEntityKey[]): void {
        throw new Error('Method not implemented.');
    }
    setPredicatedRestoreDirection(restoreDirection: IDirectionNew): void {
        throw new Error('Method not implemented.');
    }
    getEdgeVisibleItem(direction: IDirectionNew): IEdgeItem {
        throw new Error('Method not implemented.');
    }
    // endregion NotImplemented

    saveScrollPosition(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.saveScrollPosition();
        });
    }

    restoreScrollPosition(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.restoreScrollPosition();
        });
    }

    destroy(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.destroy();
        });
        this._collection.unsubscribe('columnsCountChanged', this._handleColumnCountChanges);
        this._options = null;
    }

    private _handleColumnCountChanges(): void {
        this.resetItems();
    }
}
