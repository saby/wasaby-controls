import { CrudEntityKey } from 'Types/source';
import { IObservable } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';

import {
    IDirectionNew,
    IEdgeItem,
    IListVirtualScrollControllerOptions,
    IScrollOnReset,
    IScrollMode,
    ICalcMode,
    ITriggerPosition,
    IAdditionalTriggersOffsets,
    IEdgeItemCalculatingParams,
} from 'Controls/baseList';
import { GroupItem } from 'Controls/display';
import { Logger } from 'UI/Utils';

import ColumnVirtualScrollController from 'Controls/_columns/controllers/ColumnVirtualScrollController';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import CollectionItem from 'Controls/_columns/display/CollectionItem';
import { COLUMN_SELECTOR } from 'Controls/_columns/Constants';
import { addToLog } from 'Controls/Utils/LogUtil';

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

    private _scheduleUpdateContainers: boolean;

    private get _collection(): ColumnsCollection {
        return this._options.collection as unknown as ColumnsCollection;
    }

    constructor(options: IListVirtualScrollControllerOptions) {
        this._options = { ...options };

        this._handleIndexesChanged = this._handleIndexesChanged.bind(this);
        this._handleColumnCountChanges = this._handleColumnCountChanges.bind(this);
        this._handleColumnsSnapshotChanged = this._handleColumnsSnapshotChanged.bind(this);
        if (options.collection) {
            this.setCollection(options.collection);
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
            const columnSelector = this._getColumnSelector(columnIndex);
            const itemsContainerUniqueSelector = `${this._options.itemsContainerUniqueSelector} > ${columnSelector}`;
            this._columnControllers[columnIndex] = new ColumnVirtualScrollController({
                ...this._options,
                itemsContainer: null,
                listContainer: this._listContainer,
                scrollPosition: this._scrollPosition,
                viewportSize: this._viewportSize,
                contentSize: this._contentSize,
                itemsContainerUniqueSelector,
                column: columnIndex,
                virtualScrollConfig: {
                    ...this._options.virtualScrollConfig,
                    pageSize: pageSizeInColumn,
                },
                updatePlaceholdersUtil: (placeholders) => {
                    if (!this._shouldHandleColumnCallbacks(columnIndex)) {
                        return;
                    }
                    return this._options.updatePlaceholdersUtil(placeholders);
                },
                doScrollUtil: (scrollParam) => {
                    if (!this._shouldHandleColumnCallbacks(columnIndex)) {
                        return;
                    }
                    if (
                        this._scrollPosition <
                        this._columnControllers[columnIndex].getContentSizeBeforeList()
                    ) {
                        return;
                    }
                    return this._options.doScrollUtil(scrollParam);
                },
            });
        }

        if (this._scrollOnReset === 'reset' && !!this._scrollPosition) {
            this._options.doScrollUtil('top');
        }

        // itemsContainer по факту не изменится, но каждая колонка отрисуется заново
        // и в контроллер для каждой колонки нужно засетить новый контейнер
        this._scheduleUpdateContainers = true;
    }

    // Удаление, добавление и перемещение обрабатываем по событию о изменении распределения записей по колонкам.
    addItems(
        _position: number,
        _count: number,
        _scrollMode: IScrollMode,
        _calcMode: ICalcMode
    ): void {
        return;
    }

    moveItems(
        _addPosition: number,
        _addCount: number,
        _removePosition: number,
        _removeCount: number
    ): void {
        return;
    }

    removeItems(
        _position: number,
        _removedItems: CollectionItem[],
        _scrollMode: IScrollMode
    ): void {
        return;
    }

    private _handleColumnsSnapshotChanged(
        _: SyntheticEvent,
        column: number,
        action: string,
        newItems: CollectionItem[],
        newItemsIndex: number,
        removedItems: CollectionItem[],
        removedItemsIndex: number
    ): void {
        const columnController = this._columnControllers[column];
        switch (action) {
            case IObservable.ACTION_ADD:
                const scrollMode =
                    newItemsIndex === 0 ??
                    this._scrollPosition <= columnController.getContentSizeBeforeList()
                        ? 'unfixed'
                        : 'fixed';
                columnController.addItems(newItemsIndex, newItems.length, scrollMode, 'shift');
                break;
            case IObservable.ACTION_REMOVE:
                columnController.removeItems(removedItemsIndex, removedItems.length, 'fixed');
                break;
            case IObservable.ACTION_MOVE:
                columnController.moveItems(
                    newItemsIndex,
                    newItems.length,
                    removedItemsIndex,
                    removedItems.length
                );
                break;
        }
    }

    private _handleColumnCountChanges(): void {
        this.resetItems();
    }

    private _handleIndexesChanged(
        _event: SyntheticEvent,
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirectionNew,
        column: number
    ): void {
        if (!Object.keys(this._columnControllers).length) {
            return;
        }

        addToLog('DebugColumnsVirtualScroll', 1, () => {
            return {
                title: 'ColumnsVirtualScrollController',
                message: '_handleIndexesChanged',
                data: [
                    ['column', column],
                    ['startIndex', startIndex],
                    ['endIndex', endIndex],
                ],
            };
        });

        const startItemsOffset = this._getStartItemsOffset();
        const minStartItemOffset = this._getMinStartItemOffset(startItemsOffset);
        this._saveScrollPosition(startItemsOffset, minStartItemOffset, shiftDirection);
        this._updateCollectionPlaceholders(minStartItemOffset);
        Object.values(this._columnControllers).forEach((it) => {
            return it.checkTriggersVisibility(true);
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
        if (this._scheduleUpdateContainers) {
            this._scheduleUpdateContainers = false;
        }
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
        if (this._scheduleUpdateContainers) {
            this.setListContainer(this._listContainer);
            this.setItemsContainer(this._itemsContainer);
            this._scheduleUpdateContainers = false;
        }

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
        this._scrollPosition = position;
        Object.values(this._columnControllers).forEach((it) => {
            return it.scrollPositionChange(position);
        });
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
        if (this._collection && !this._collection.destroyed) {
            this._collection.unsubscribe('indexesChanged', this._handleIndexesChanged);
            this._collection.unsubscribe('columnsCountChanged', this._handleColumnCountChanges);
            this._collection.unsubscribe(
                'columnsSnapshotChanged',
                this._handleColumnsSnapshotChanged
            );
        }
        this._options.collection = collection;
        if (this._collection) {
            this._collection.subscribe('indexesChanged', this._handleIndexesChanged);
            this._collection.subscribe('columnsCountChanged', this._handleColumnCountChanges);
            this._collection.subscribe(
                'columnsSnapshotChanged',
                this._handleColumnsSnapshotChanged
            );
        }
        this.resetItems();
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        this._itemsContainer = itemsContainer;
        Object.values(this._columnControllers).forEach((controller, column) => {
            return controller.setItemsContainer(this._getColumnItemsContainer(column));
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
    setActiveElementKey(_activeElementKey: CrudEntityKey): void {
        throw new Error('Method not implemented.');
    }

    setRenderedItems(_renderedItems: CrudEntityKey[]): void {
        throw new Error('Method not implemented.');
    }

    setPredicatedRestoreDirection(_restoreDirection: IDirectionNew): void {
        throw new Error('Method not implemented.');
    }

    getEdgeVisibleItem(_direction: IDirectionNew): IEdgeItem {
        throw new Error('Method not implemented.');
    }

    // endregion NotImplemented

    // region RestoreScroll

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

    // endregion RestoreScroll

    destroy(): void {
        Object.values(this._columnControllers).forEach((it) => {
            return it.destroy();
        });
        this._collection.unsubscribe('indexesChanged', this._handleIndexesChanged);
        this._collection.unsubscribe('columnsCountChanged', this._handleColumnCountChanges);
        this._collection.unsubscribe('columnsSnapshotChanged', this._handleColumnsSnapshotChanged);
        this._options = null;
    }

    private _getColumnItemsContainer(column: number): HTMLElement {
        const columnSelector = this._getColumnSelector(column);
        return this._itemsContainer?.querySelector(columnSelector) as HTMLElement;
    }

    private _getColumnSelector(column: number): string {
        return `${COLUMN_SELECTOR}_${column}`;
    }

    /**
     * Считает минимальный размер оффсета у стартовой записи среди всех колонок.
     * @private
     */
    private _getMinStartItemOffset(startItemsOffset: number[]): number {
        let minItemOffset = startItemsOffset[0];
        startItemsOffset.forEach((itemOffset) => {
            if (itemOffset < minItemOffset) {
                minItemOffset = itemOffset;
            }
        });
        return minItemOffset;
    }

    private _getStartItemsOffset(): number[] {
        const startItemsOffset = Object.values(this._columnControllers).map(
            (controller, column) => {
                const startIndex = this._collection.getColumnRange(column).startIndex;
                const itemsSizes = controller.getItemsSizes();
                const startItemSize = itemsSizes[startIndex];
                if (!startItemSize?.offset) {
                    return controller.getContentSizeBeforeList() || 0;
                }

                const prevStartItemSize = itemsSizes[startIndex - 1];
                if (!prevStartItemSize) {
                    return startItemSize.offset;
                }

                const offsetBetweenLastItems =
                    startItemSize.offset - prevStartItemSize.offset - prevStartItemSize.size;
                return startItemSize.offset - offsetBetweenLastItems / 2;
            }
        );

        addToLog('DebugColumnsVirtualScroll', 1, () => {
            return {
                title: 'ColumnsVirtualScrollController',
                message: '_getStartItemsOffset',
                data: [['startItemsOffset', startItemsOffset]],
            };
        });

        return startItemsOffset;
    }

    private _shouldHandleColumnCallbacks(column: number): boolean {
        // Управлять позицией скролла и плейсхолдерами должна колонка, в которой лежит запись сс самой верхней записью
        const startItemsOffset = this._getStartItemsOffset();
        const minItemOffset = this._getMinStartItemOffset(startItemsOffset);
        const columnWithTopItem = startItemsOffset.indexOf(minItemOffset);
        return column === columnWithTopItem;
    }

    private _saveScrollPosition(
        startItemsOffset: number[],
        minStartItemOffset: number,
        shiftDirection: IDirectionNew
    ): void {
        // После смещения виртуального диапазона в одной из колонок, другая колонка может стать с самой верхней записью
        // и именно она должна восстанавливать скролл
        const columnWithMinOffset = startItemsOffset.indexOf(minStartItemOffset);
        const saveScrollParams: IEdgeItemCalculatingParams = {
            direction: shiftDirection,
            offset: this._collection.getColumnPlaceholder(columnWithMinOffset) * -1,
        };
        this._columnControllers[columnWithMinOffset].saveScrollPosition(saveScrollParams, true);
    }

    private _updateCollectionPlaceholders(minStartItemOffset: number): void {
        // Отдельная утилита, т.к. updatePlaceholdersUtil срабатывает на afterRender,
        // а модель нужно обновить сразу же
        let hasEmptyPlaceholder = false;

        Object.values(this._columnControllers).map((controller, column) => {
            const placeholders = controller.getPlaceholders();
            // Плейсхолдер не включает контент до списка, а оффсет записи включает
            const contentSizeBeforeList = controller.getContentSizeBeforeList();
            const backwardPlaceholder = Math.max(
                placeholders.backward + contentSizeBeforeList - minStartItemOffset,
                0
            );

            // Для валидации округляем плейсхолдер до целых, в колонках часто размеры записей дробные числа
            // и плэйсхолдеры тоже получаются дробными. Иногда 0 с дробной частью.
            // Округлять реальный размер плейсхолдера нельзя, т.к. будут заметные смещения примерно на 1px.
            // Из-за того, что диапазон смещается в каждой колонке отдельно,
            // то между колонками прыжок в 1px сильно бросается в глаза.
            if (!Math.round(backwardPlaceholder)) {
                hasEmptyPlaceholder = true;
            }

            addToLog('DebugColumnsVirtualScroll', 1, () => {
                return {
                    title: 'ColumnsVirtualScrollController',
                    message: '_updateCollectionPlaceholders',
                    data: [
                        ['column', column],
                        ['backwardPlaceholder', backwardPlaceholder],
                    ],
                };
            });

            controller.setNewColumnPlaceholder(backwardPlaceholder);
        });

        if (!hasEmptyPlaceholder) {
            Logger.error(
                'Внутрення ошибка списка. Должна существовать колонка, в которой нет плейсхолдера.'
            );
        }
    }
}
