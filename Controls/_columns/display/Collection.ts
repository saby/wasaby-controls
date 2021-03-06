import {Tree as BaseCollection, ItemsFactory, IDragPosition} from 'Controls/display';
import CollectionItem, {IOptions as ICollectionItemOptions} from './CollectionItem';
import ColumnsDragStrategy from './itemsStrategy/ColumnsDrag';
import { Model } from 'Types/entity';
import IColumnsStrategy from '../interface/IColumnsStrategy';
import Auto from './columnsStrategy/Auto';
import Fixed from './columnsStrategy/Fixed';
import {DEFAULT_COLUMNS_COUNT, DEFAULT_MIN_WIDTH, SPACING} from '../Constants';
import DragStrategy from 'Controls/_display/itemsStrategy/Drag';

export default class Collection<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends BaseCollection<S, T> {
    protected _$columnProperty: string;
    readonly SupportExpand: boolean = false;
    protected _dragStrategy: ColumnsDragStrategy<S, T> = ColumnsDragStrategy;
    protected _columnsStrategy: IColumnsStrategy;
    protected _addingColumnsCounter: number;
    protected _columnsIndexes: number[][];
    protected _$columnsCount: number;
    protected _$columnsMode: 'auto' | 'fixed';
    protected _$columnMinWidth: number;
    protected _currentWidth: number;
    protected _columnsCount: number;
    protected _dragColumn: number = null;
    protected _$spacing: number = SPACING;
    protected _$viewMode: string;

    constructor(options) {
        super(options);
        this._columnsStrategy = this._$columnsMode === 'fixed' ? new Fixed() : new Auto();
        this._addingColumnsCounter = options.collection ? options.collection.getCount() : 0;
        if (this._$columnsMode === 'auto' && options.initialWidth) {
            this.setCurrentWidth(options.initialWidth, options.columnMinWidth);
        } else {
            this.setColumnsCount(this._$columnsCount || DEFAULT_COLUMNS_COUNT);
        }
        this.updateColumns();
    }

    setColumnsMode(columnsMode) {
        if (this._$columnsMode !== columnsMode) {
            this._columnsStrategy = columnsMode === 'fixed' ? new Fixed() : new Auto();
            this._$columnsMode = columnsMode;
            this.updateColumns();
            this._nextVersion();
        }
    }

    protected _notifyCollectionChange(
        action: string,
        newItems: T[],
        newItemsIndex: number,
        oldItems: T[],
        oldItemsIndex: number
    ): void {
        super._notifyCollectionChange.apply(this, arguments);

        if (action === 'a') {
            newItems.forEach(this.setColumnOnItem.bind(this, newItemsIndex - this._addingColumnsCounter));
            if (this._$columnsMode === 'auto' && newItems.length === 1) {
                this._addingColumnsCounter++;
            }
            if (this._dragColumn === null && this._$viewMode === 'list') {
                this.updateColumns(newItemsIndex);
            }
        }
        if (action === 'rm') {
            this.processRemoving(oldItemsIndex, oldItems);
            if (this._dragColumn === null && this._$viewMode === 'list') {
                this.updateColumns();
            }
        }
        if (action === 'rs') {
            this.updateColumns();
            this._addingColumnsCounter = newItems.length;
        } else {
            this.updateColumnIndexesByItems();
        }
    }

    setColumnsCount(columnsCount: number): void {
        if (this._$columnsCount !== columnsCount) {
            this._$columnsCount = columnsCount;
            this.updateColumns();
            this._nextVersion();
        }
    }

    setCurrentWidth(width: number, columnMinWidth: number): void {
        if (width > 0 &&
            this._currentWidth !== width &&
            this._$columnsMode === 'auto' &&
            this._$columnMinWidth || columnMinWidth
        ) {
            this._recalculateColumnsCountByWidth(width, this._$columnMinWidth || columnMinWidth);
        }
        this._currentWidth = width;
    }

    private _recalculateColumnsCountByWidth(width: number, columnMinWidth: number): void {
        const newColumnsCount = Math.floor(width / (columnMinWidth + this._$spacing));
        if (newColumnsCount !== this._columnsCount) {
            this._columnsCount = newColumnsCount || 1;
            this.setColumnsCount(this._columnsCount);
        }
    }

    getCurrentWidth(): number {
        return this._currentWidth;
    }

    getColumnsCount(): number {
        return this._$columnsCount;
    }

    getColumnsMode(): string {
        return this._$columnsMode;
    }

    setSpacing(spacing: number): void {
        if (this._$spacing !== spacing) {
            this._$spacing = spacing;
            this.updateColumns();
            this._nextVersion();
        }
    }

    getSpacing(): number {
        return this._$spacing;
    }

    private updateColumnIndexesByItems(): void {
        this._columnsIndexes = new Array<number[]>(this._$columnsCount);
        for (let i = 0; i < this._$columnsCount; i++) {
            this._columnsIndexes[i] = [];
        }
        this.each( (item, index) => {
            this._columnsIndexes[item.getColumn()].push(index as number);
        });
    }

    private setColumnOnItem(offset: number, item: T, index: number): void {
        if (!item.isDragged()) {
            const column = this._columnsStrategy.calcColumn(this, this._dragColumn === null ? index + this._addingColumnsCounter + offset : this._dragColumn, this._$columnsCount);
            item.setColumn(column);
        }
    }

    /**
     * ?????????????????????????? ???????????? ?????????????? ?? ??????????????
     * @param {number} [offset=-1] - ???????????????????? ???????????? ???? ???????????? ?? ???????????????? offset. (-1 - ???????????????? ?????? ????????????)
     */
    private updateColumns(offset: number = -1): void {
        this._addingColumnsCounter = 0;
        this._columnsIndexes = null;
        this.each((item: T, index: number) => {
            if (index > offset) {
                this.setColumnOnItem(0, item, index);
            }
        });
        this.updateColumnIndexesByItems();
    }

    processRemovingItem(item: any): boolean {
        let done = true;

        this._addingColumnsCounter--;
        if (this._addingColumnsCounter < 0) {
            this._addingColumnsCounter += this._$columnsCount;
        }
        if (item.columnIndex >= this._columnsIndexes[item.column].length) {
            done = false;
            while (!done && (item.column + 1) < this._$columnsCount) {

                if (this._columnsIndexes[item.column + 1].length > this._columnsIndexes[item.column].length) {

                    if (this._columnsIndexes[item.column + 1].length > 1) {
                        done = true;
                    }
                    const nextIndex = this._columnsIndexes[item.column + 1].pop();
                    this._columnsIndexes[item.column].push(nextIndex);

                    // ?????? ???????????????? ?? ???????????? ????????????, ???????????? ???? ?????????????????? ???? recordSet'a, ?? ???????????? ???? ????????????????.
                    // ?????????????? ?????????? ???????????????? ???? ???????????? ???? ????????????????, ?? ???? recordSet.
                    const nextItem = this.at(nextIndex) as CollectionItem<Model>;
                    nextItem.setColumn(item.column);
                }
                item.column++;
            }
        }
        return !done;
    }

    processRemoving(removedItemsIndex: number, removedItems: CollectionItem<Model>[]): void {
        const removedItemsIndexes = removedItems.map((item, index) => {
            const column = item.getColumn();
            const columnIndex = this._columnsIndexes[column].findIndex((elem) => elem === (index + removedItemsIndex));
            return {
                column,
                columnIndex
            };
        });
        this.updateColumnIndexesByItems();
        const needLoadMore = removedItemsIndexes.some(this.processRemovingItem.bind(this));

        if (needLoadMore) {
            this._notify('loadMore', ['down']);
        }
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: ICollectionItemOptions<S>): T {
            options.columnProperty = this._$columnProperty;
            options.owner = this;
            return superFactory.call(this, options);
        };
    }

    getColumnProperty(): string {
        return this._$columnProperty;
    }

    getIndexInColumnByIndex(index: number): number {
        const column = this.at(index).getColumn();
        return this._columnsIndexes[column].indexOf(index);
    }
    //#region getItemToDirection

    private getItemToLeft(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (this._$columnsMode === 'auto') {
            if (curIndex > 0) {
                newIndex = curIndex - 1;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumn > 0) {
                const prevColumn = this._columnsIndexes.slice().reverse().find(
                    (col: number[], index: number) => index > this._$columnsCount - curColumn - 1 && col.length > 0);

                if (prevColumn instanceof Array) {
                    newIndex = prevColumn[Math.min(prevColumn.length - 1, curColumnIndex)];
                }
            }
        }
        return this.at(newIndex);
    }

    private getItemToRight(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (this._$columnsMode === 'auto') {
            if (curIndex < this.getCount() - 1) {
                newIndex = curIndex + 1;
            } else if (curIndex > this._$columnsCount) {
                newIndex = curIndex + 1 - this._$columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumn < this._$columnsCount - 1) {
                const nextColumn = this._columnsIndexes.find(
                    (col: number[], index: number) => index > curColumn && col.length > 0);

                if (nextColumn instanceof Array) {
                    newIndex = nextColumn[Math.min(nextColumn.length - 1, curColumnIndex)];
                }
            }
        }
        return this.at(newIndex);
    }

    private getItemToUp(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (this._$columnsMode === 'auto') {
            if (Math.round(curIndex / this._$columnsCount) > 0) {
                newIndex = curIndex - this._$columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumnIndex > 0) {
                newIndex = this._columnsIndexes[curColumn][curColumnIndex - 1];
            } else {
                newIndex = curIndex;
            }
        }
        return this.at(newIndex);
    }

    private getItemToDown(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (this._$columnsMode === 'auto') {
            if (curIndex + this._$columnsCount < this.getCount()) {
                newIndex = curIndex + this._$columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumnIndex < this._columnsIndexes[curColumn].length - 1) {
                newIndex = this._columnsIndexes[curColumn][curColumnIndex + 1];
            } else {
                newIndex = curIndex;
            }
        }
        return this.at(newIndex);
    }

    //#endregion

    setDragPosition(position: IDragPosition<T>): void {
        if (position) {
            const strategy = this.getStrategyInstance(this._dragStrategy) as unknown as ColumnsDragStrategy<S>;

            const newColumn = position.dispItem.getColumn();
            const curColumn = strategy.avatarItem.getColumn();

            if (position.position !== 'on' && curColumn !== newColumn) {
                // ?????????????????? ?????????? ?????????????? ?? ???????????????????????????????? ????????????????
                strategy.avatarItem.setColumn(newColumn);

                // ???????????????????????? position.position, ???????? ???????????????? ??????????????, ???? ?????????????? ?????????? ???????????? before
                position.position = 'before';
            }
        }
        super.setDragPosition(position);
    }

    resetDraggedItems(): void {
        const strategy = this.getStrategyInstance(this._dragStrategy) as unknown as ColumnsDragStrategy<S>;
        const avatarItem = strategy.avatarItem;
        this._dragColumn = avatarItem.getColumn();
        super.resetDraggedItems();
        this._dragColumn = null;
    }
}

Object.assign(Collection.prototype, {
    '[Controls/_columns/display/Collection]': true,
    _moduleName: 'Controls/columns:ColumnsCollection',
    _itemModule: 'Controls/columns:ColumnsCollectionItem',
    _$columnsCount: 2,
    _$spacing: 12,
    _$columnsMode: 'auto',
    _$viewMode: ''
});
