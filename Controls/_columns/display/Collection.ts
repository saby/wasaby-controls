/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import {
    ItemsFactory,
    IDragPosition,
    IViewIterator,
    IItemPadding,
    GroupItem,
} from 'Controls/display';
import { Tree, ITreeOptions } from 'Controls/baseTree';
import CollectionItem, { IOptions as ICollectionItemOptions } from './CollectionItem';
import ColumnsDragStrategy from './itemsStrategy/ColumnsDrag';
import { Model } from 'Types/entity';
import IColumnsStrategy from '../interface/IColumnsStrategy';
import Auto from './columnsStrategy/Auto';
import Fixed from './columnsStrategy/Fixed';
import Adaptive from './columnsStrategy/Adaptive';
import { DEFAULT_COLUMNS_COUNT, SPACING } from '../Constants';
import { EnumeratorCallback } from 'Types/collection';
import { StrategyConstructor } from 'Controls/_display/Collection';
import { IItemsRange, IDirectionNew } from 'Controls/baseList';
import { isEqual } from 'Types/object';
import { IObservable } from 'Types/collection';
import ColumnsSnapshotUpdatingSession from './ColumnsSnapshotUpdatingSession';
import { CrudEntityKey } from 'Types/source';
import { ColumnsMode } from '../interface/IColumnsView';

export { ColumnsMode };

interface IRemovedItemInfo<TItem> {
    item: TItem;
    // Индекс колонки из которой был удален итем
    column: number;
    // Индекс удаленного итема относительно набора колонки
    columnIndex: number;
}

export interface IColumnItemSnapshot {
    index: number;
    key: CrudEntityKey;
}

interface IGroupColumnsSnapshot {
    // Для каждой колонки хранит индексы записей коллекции, принадлежащие этой колонке
    columns: IColumnItemSnapshot[][];
    // Индексы записей коллекции, которые входят в группу. Первый индекс это индекс записи самой группы
    range: [number, number];
}

interface IColumnsOptions<S extends Model = Model, T extends CollectionItem = CollectionItem>
    extends ITreeOptions<S, T> {
    initialWidth?: number;
    columnMinWidth?: number;
    columnsCount?: number;
    columnsMode?: ColumnsMode;
    maxColumnsCount?: number;
    /**
     * Если выставлено в true, то при добавлении/удалении итемов
     * коллекции мы полностью пересчитываем распределение итемов по колонкам
     */
    autoColumnsRecalculating?: boolean;
    itemsContainerPadding?: IItemPadding;
}

/**
 * Коллекция, которая распределяет элементы на несколько столбцов
 * @private
 */
export default class ColumnsCollection<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>,
> extends Tree<S, T> {
    readonly SupportExpand: boolean = false;

    protected _columnsStrategy: IColumnsStrategy;
    protected _dragStrategy: StrategyConstructor<ColumnsDragStrategy<S, T>> = ColumnsDragStrategy;

    protected _$columnProperty: string;
    protected _$columnsCount: number;
    protected _$maxColumnsCount: number;
    protected _$columnsMode: ColumnsMode;
    protected _$columnMinWidth: number;
    protected _currentWidth: number;
    protected _columnsCount: number;
    protected _dragColumn: number = null;
    // true если при изменении коллекции нужно пересчитать расположение итемов по колонкам
    protected _$autoColumnsRecalculating: boolean;
    protected _$itemHeightCallback: (Model) => number;
    protected _$imageProperty: string;
    protected _$fallbackImage: string;

    protected _$leftContainerPadding: string;
    protected _$rightContainerPadding: string;

    // Итератор, перебирающий только записи групп
    private readonly _groupsIterator: IViewIterator;

    protected _columnsHeight: number[];
    protected _itemsHeightsCache: object = {};
    // Снимок состояния колонок для списка без группировки
    private _columnsSnapshot: IGroupColumnsSnapshot;
    // Снимки состояния колонок для каждой группы
    private _groupsColumnsSnapshot: { [key: string]: IGroupColumnsSnapshot };
    private _columnRanges: Record<number, IItemsRange> = {};
    private _columnPlaceholders: Record<number, number> = {};

    constructor(options: IColumnsOptions<S, T>) {
        super(options);

        if (options.itemsContainerPadding) {
            this._setItemsContainerPadding(options.itemsContainerPadding);
        }

        this._columnsStrategy =
            options.columnsMode === 'fixed'
                ? new Fixed()
                : options.columnsMode === 'adaptive'
                ? new Adaptive()
                : new Auto();

        this._columnsCount = this._$columnsCount;
        if (this._$columnsMode === 'auto' && options.initialWidth) {
            this.setCurrentWidth(options.initialWidth, options.columnMinWidth);
        } else {
            this.setColumnsCount(this._$columnsCount || DEFAULT_COLUMNS_COUNT);
        }

        this.resetColumnsHeight();
        this.updateColumnsSnapshots();

        this._groupsIterator = {
            each: this.eachGroups.bind(this),
            setIndices: () => {
                return false;
            },
            isItemAtIndexHidden: () => {
                return false;
            },
        };
    }

    protected _initializeUserStrategies(): void {
        this._supportItemsSpacing = false;
        super._initializeUserStrategies();
    }

    // region Iterators
    /**
     * Возвращает итератор, перебирающий все итемы коллекции.
     * В случае если передана запись группы, то будет возвращен итератор,
     * перебирающий только записи указанной группы.
     */
    getViewIterator(column?: number, groupItem?: GroupItem<unknown>): IViewIterator {
        if (column === undefined) {
            return super.getViewIterator();
        }

        // Если запись группы не передана, то возвращаем дефолтный итератор
        if (!groupItem) {
            return this._getColumnViewIterator(column);
        }

        return {
            each: (callback: EnumeratorCallback<T>, context?: object): void => {
                this._eachGroupItems(column, groupItem, callback, context);
            },
            setIndices: () => {
                return false;
            },
            isItemAtIndexHidden: () => {
                return false;
            },
        };
    }

    private _getColumnViewIterator(column: number): IViewIterator {
        return {
            each: (callback: (item: CollectionItem, index: number) => void) => {
                const columnRange = this.getColumnRange(column);

                let position = columnRange.startIndex;
                while (position < columnRange.endIndex) {
                    const currentItemCollectionIndex =
                        this._columnsSnapshot.columns[column][position].index;
                    const currentItem = this.at(currentItemCollectionIndex);
                    callback(currentItem, position);

                    position++;
                }
            },
            setIndices: () => {
                return false;
            },
            isItemAtIndexHidden: () => {
                return false;
            },
        } as unknown as IViewIterator;
    }

    /**
     * Перебирает записи указанной группы
     */
    private _eachGroupItems(
        column: number,
        group: GroupItem<unknown>,
        callback: EnumeratorCallback<T>,
        context?: object
    ): void {
        const groupFunction = this.getGroup();

        this.each((item, index: number) => {
            if (!item['[Controls/_columns/display/CollectionItem]']) {
                return;
            }

            const itemGroup = groupFunction(item.getContents(), index, item);
            if (group.getContents() !== itemGroup) {
                return;
            }

            const itemColumn = item.getColumn();
            if (itemColumn !== column) {
                return;
            }

            const itemIndexInColumn = this.getIndexInColumnByIndex(index);
            const columnRange = this.getColumnRange(column);
            if (
                itemIndexInColumn === undefined ||
                itemIndexInColumn < columnRange.startIndex ||
                itemIndexInColumn >= columnRange.endIndex
            ) {
                return;
            }

            callback.call(context, item, index);
        });
    }

    /**
     * Возвращает итератор, перебирающий только записи групп
     */
    getGroupsIterator(): IViewIterator {
        return this._groupsIterator;
    }

    /**
     * Вызывает переданный callback только для записей групп
     */
    eachGroups(callback: EnumeratorCallback<GroupItem<unknown>>, context?: object): void {
        let index = 0;
        this.each((item) => {
            if (!item['[Controls/_display/GroupItem]']) {
                return;
            }

            callback.call(context, item, index);
            index += 1;
        });
    }

    shouldRenderGroup(group: GroupItem): boolean {
        const groupColumns = this._groupsColumnsSnapshot[group.key].columns;
        const firstGroupItemInRange = groupColumns.find((columnSnapshot, column) => {
            const columnRange = this.getColumnRange(column);
            const firstItemCollectionIndex = columnSnapshot[0]?.index;
            const firstItemColumnIndex = this.getIndexInColumnByIndex(firstItemCollectionIndex);
            return (
                firstItemColumnIndex >= columnRange.startIndex &&
                firstItemColumnIndex < columnRange.endIndex
            );
        });
        return !!firstGroupItemInRange || !group.isExpanded();
    }

    // endregion

    // region Process collection change
    protected _notifyCollectionChange(
        action: string,
        newItems: T[],
        newItemsIndex: number,
        oldItems: T[],
        oldItemsIndex: number
    ): void {
        super._notifyCollectionChange.apply(this, arguments);

        if (action === IObservable.ACTION_RESET) {
            this.resetColumnsHeight();
            this.updateColumnsSnapshots();
            return;
        }

        const updateSession = new ColumnsSnapshotUpdatingSession(this, this._notify.bind(this));
        updateSession.start();

        if (action === IObservable.ACTION_ADD) {
            // Если все колонки пересчитывать не требуется,
            // то добавляем новые итемы по месту в соответствии с их индексами.
            if (!this._$autoColumnsRecalculating) {
                newItems.forEach((item, index) => {
                    if (item['[Controls/_display/GroupItem]']) {
                        return;
                    }

                    const snapshot = this.getColumnsSnapshotByItem(item);

                    // Высчитываем индекс добавленного итема относительно группы
                    // либо относительно всего списка, если группировка не задана.
                    // -1 так как нам тут не нужно учитывать саму запись группы
                    const indexRelativeToGroup =
                        newItemsIndex + index - snapshot.range[0] - (this.getGroup() ? 1 : 0);
                    this.setColumnOnItem(item, indexRelativeToGroup);
                });

                this.updateColumnsSnapshots(0, false);
            } else if (this._dragColumn === null) {
                this.resetColumnsHeight();
                this.updateColumnsSnapshots(newItemsIndex);
            }
        }

        if (action === IObservable.ACTION_REMOVE) {
            if (!this._$autoColumnsRecalculating) {
                this.processRemoving(oldItemsIndex, oldItems);
            } else if (this._dragColumn === null) {
                this.resetColumnsHeight();
                this.updateColumnsSnapshots();
            }
        }

        if (action === IObservable.ACTION_MOVE) {
            if (!this._$autoColumnsRecalculating) {
                this.updateColumnsSnapshots(-1, false);
            } else if (this._dragColumn === null) {
                this.resetColumnsHeight();
                this.updateColumnsSnapshots();
            }
        }

        updateSession.finish(oldItems);
    }

    /**
     * * Обновляет информацию о том какие записи в какой колонке лежат
     * * И если нужно переносит данные между колонками
     */
    private processRemoving(
        removedItemsIndex: number,
        removedItems: CollectionItem<Model>[]
    ): void {
        // Индексы удаленных элементов относительно колонок
        const removedItemsIndexes = removedItems
            .filter((item) => {
                return !item['[Controls/_display/GroupItem]'];
            })
            .map((item: T, index): IRemovedItemInfo<T> => {
                const column = item.getColumn();
                const snapshot = this.getColumnsSnapshotByItem(item);
                const columnIndex = snapshot.columns[column].findIndex((elem) => {
                    return elem.index === index + removedItemsIndex;
                });

                return {
                    item,
                    column,
                    columnIndex,
                };
            });

        this.updateColumnsSnapshots(0, false);
        removedItemsIndexes.forEach(this.processRemovingItem.bind(this));
    }

    /**
     * * При удалении записи остальные не перемешиваются, а остаются в своих столбцах.
     * * При удалении последней записи в столбце ищет следующий столбец где записей больше
     * чем в текущем и переносит последнюю запись из найденного столбца в текущий.
     *
     * @remark
     * На момент вызова <i>_columnsIndexes</i> уже должны быть обновлены и не учитывать удаленную запись.
     */
    private processRemovingItem(removedItemInfo: IRemovedItemInfo<T>): void {
        const snapshot = this.getColumnsSnapshotByItem(removedItemInfo.item, false);
        // Индексы записей коллекции, принадлежащих колонке удаленной записи
        const affectedColumnIndexes = snapshot?.columns[removedItemInfo.column];
        // Если удалили не последний итем колонки, то ничего делать не надо
        if (!affectedColumnIndexes || removedItemInfo.columnIndex < affectedColumnIndexes.length) {
            return;
        }

        let nextColumnIndex = removedItemInfo.column + 1;
        let nextColumnIndexes =
            nextColumnIndex < this._$columnsCount ? snapshot.columns[nextColumnIndex] : null;

        // Ищем следующую колонку в которой записей больше чем в текущей.
        // И переносим её последний итем в текущую колонку вместо удаленного.
        while (nextColumnIndexes) {
            if (nextColumnIndexes.length > affectedColumnIndexes.length) {
                const nextIndex = nextColumnIndexes.pop();
                affectedColumnIndexes.push(nextIndex);

                // При переносе в другой раздел, записи не удаляются из recordSet'a, а только из проекции.
                // Поэтому нужно смотреть на запись из проекции, а не recordSet.
                const nextItem = this.at(nextIndex.index) as CollectionItem<Model>;
                nextItem.setColumn(removedItemInfo.column);

                break;
            }

            nextColumnIndex++;
            nextColumnIndexes =
                nextColumnIndex < this._$columnsCount ? snapshot.columns[nextColumnIndex] : null;
        }

        return;
    }
    // endregion

    // region get/set methods
    protected _setItemPadding(itemPadding: IItemPadding, silent?: boolean): void {
        super._setItemPadding(itemPadding, silent);
        if (this._currentWidth > 0 && this._$columnsMode === 'auto' && this._$columnMinWidth) {
            this._recalculateColumnsCountByWidth(this._currentWidth, this._$columnMinWidth);
        }
    }

    setCurrentWidth(width: number, columnMinWidth: number): void {
        if (
            (width > 0 &&
                this._currentWidth !== width &&
                this._$columnsMode === 'auto' &&
                this._$columnMinWidth) ||
            columnMinWidth
        ) {
            this._recalculateColumnsCountByWidth(width, this._$columnMinWidth || columnMinWidth);
        }
        this._currentWidth = width;
    }

    private _recalculateColumnsCountByWidth(width: number, columnMinWidth: number): void {
        let newColumnsCount = Math.floor(
            (width - this.getSideSpacing() + this.getSpacing()) /
                (columnMinWidth + this.getSpacing())
        );
        if (newColumnsCount !== this._columnsCount) {
            if (this._$maxColumnsCount && newColumnsCount > this._$maxColumnsCount) {
                newColumnsCount = this._$maxColumnsCount;
            }
            this._columnsCount = newColumnsCount || 1;
            this.setColumnsCount(this._columnsCount);
        }
    }

    getCurrentWidth(): number {
        return this._currentWidth;
    }

    setColumnMinWidth(columnMinWidth: number): void {
        if (
            this._$columnMinWidth !== columnMinWidth &&
            this._$columnsMode === 'auto' &&
            columnMinWidth
        ) {
            this._recalculateColumnsCountByWidth(this._currentWidth, columnMinWidth);
        }

        this._$columnMinWidth = columnMinWidth;
    }

    setColumnsCount(columnsCount: number): void {
        if (this._$columnsCount !== columnsCount) {
            let newColumnsCount = columnsCount;
            if (this._$maxColumnsCount && newColumnsCount > this._$maxColumnsCount) {
                newColumnsCount = this._$maxColumnsCount;
            }
            this._$columnsCount = newColumnsCount;
            this._columnsCount = newColumnsCount;
            this.resetColumnsHeight();
            this.updateColumnsSnapshots();
            this._notify('columnsCountChanged');
            this._nextVersion();
        }
    }

    setMaxColumnsCount(maxColumnsCount: number): void {
        if (this._$maxColumnsCount !== maxColumnsCount) {
            this._$maxColumnsCount = maxColumnsCount;
            if (this._$maxColumnsCount && this._columnsCount > maxColumnsCount) {
                this.setColumnsCount(maxColumnsCount);
            }
            if (!maxColumnsCount) {
                this._recalculateColumnsCountByWidth(this._currentWidth, this._$columnMinWidth);
            }
            this._nextVersion();
        }
    }

    getColumnsCount(): number {
        return this._$columnsCount;
    }

    getItemsCountInColumns(column: number): number {
        return this.getColumnsSnapshot().columns[column]?.length || 0;
    }

    getColumnRanges(): Record<number, IItemsRange> {
        return { ...this._columnRanges };
    }

    setColumnRange(column: number, columnRange: IItemsRange, shiftDirection: IDirectionNew): void {
        if (!isEqual(this._columnRanges[column], columnRange)) {
            this._columnRanges[column] = columnRange;
            this._notify(
                'indexesChanged',
                columnRange.startIndex,
                columnRange.endIndex,
                shiftDirection,
                column
            );
            this._nextVersion();
        }
    }

    getColumnRange(column: number): IItemsRange {
        return (
            this.getColumnRanges()[column] || {
                startIndex: 0,
                endIndex: this.getItemsCountInColumns(column),
            }
        );
    }

    setColumnPlaceholder(column: number, placeholder: number): void {
        this._columnPlaceholders[column] = placeholder;
    }

    getColumnPlaceholder(column: number): number {
        return this._columnPlaceholders[column] || 0;
    }

    setColumnsMode(columnsMode: ColumnsMode): void {
        if (this._$columnsMode !== columnsMode) {
            this._columnsStrategy =
                columnsMode === 'fixed'
                    ? new Fixed()
                    : columnsMode === 'adaptive'
                    ? new Adaptive()
                    : new Auto();
            this._$columnsMode = columnsMode;
            this.updateColumnsSnapshots();
            this._nextVersion();
        }
    }

    getColumnsMode(): string {
        return this._$columnsMode;
    }

    getSpacing(): number {
        return SPACING[this._$leftPadding] + SPACING[this._$rightPadding];
    }

    getSideSpacing(): number {
        return (
            SPACING[this._$leftContainerPadding || this._$leftPadding] +
            SPACING[this._$rightContainerPadding || this._$rightPadding]
        );
    }

    protected _setItemsContainerPadding(itemsContainerPadding: IItemPadding): void {
        this._$leftContainerPadding = itemsContainerPadding?.left || null;
        this._$rightContainerPadding = itemsContainerPadding?.right || null;
    }

    setItemPadding(itemPadding: IItemPadding): void {
        this._setItemPadding(itemPadding);
        this._nextVersion();
    }

    setTagStyleProperty(tagStyleProperty: string): void {
        if (this._$tagStyleProperty !== tagStyleProperty) {
            this._$tagStyleProperty = tagStyleProperty;
            this.updateColumnsSnapshots();
            this._nextVersion();
        }
    }
    // endregion

    setColumnsHeight(columnsHeight: number[]): void {
        this._columnsHeight = [...columnsHeight];
    }

    setItemsHeightsCache(itemsHeightsCache: object): void {
        this._itemsHeightsCache = itemsHeightsCache;
    }

    resetColumnsHeight(): void {
        this._columnsHeight = [];
        for (let i = 0; i < this._columnsCount; i++) {
            this._columnsHeight[i] = 0;
        }
    }

    // Добавление записей происходит порциями. Пока они не будут отрисованы, мы не узнаем точную высоту.
    // Поэтому используем среднюю высоту записи для оценки высоты новой добавленной записи.
    // После отрисовки, высоты колонок будут актуализированы.
    protected _defaultItemHeightCallback(item: CollectionItem) {
        if (this._itemsHeightsCache[item.key]) {
            return this._itemsHeightsCache[item.key];
        }
        const sum = this._columnsHeight ? this._columnsHeight.reduce((h, s) => h + s, 0) : 0;
        if (sum && this.getCount()) {
            return sum / this.getCount();
        } else {
            return 1;
        }
    }

    getSmallestColumnIndex(): number {
        if (!this._columnsHeight) {
            this.resetColumnsHeight();
        }
        let minIndex = 0;
        this._columnsHeight.forEach((height, index) => {
            if (this._columnsHeight[index] < this._columnsHeight[minIndex]) {
                minIndex = index;
            }
        });
        return minIndex;
    }

    /**
     * Вычисляет индекс колонки к которой принадлежит итем и проставляет его в
     * сам итем.
     *
     * @param {T} item - итем коллекции
     * @param {Number} index - индекс итема коллекции относительно группы,
     * либо относительно коллекции, если группировка не задана
     *
     * @return Вычисленный индекс колонки
     */
    private setColumnOnItem(item: T, index: number): number {
        if (item['[Controls/_display/GroupItem]']) {
            return;
        }
        if (item.isDragged() && !this._$autoColumnsRecalculating) {
            return;
        }

        const i = this._dragColumn === null ? index : this._dragColumn;
        const column = this._columnsStrategy.calcColumn(this, i, this.getColumnsCount());
        if (this._$columnsMode === 'adaptive') {
            if (this._$itemHeightCallback) {
                this._columnsHeight[column] += this._$itemHeightCallback(item.contents);
            } else {
                this._columnsHeight[column] += this._defaultItemHeightCallback(item);
            }
        }
        item.setColumn(column);
        return column;
    }

    /**
     * Пересчитывает и обновляет снимки состояния колонок.
     * @param {number} [offset=-1] - пропустить записи до записи с индексом offset. (-1 - обновить все записи)
     * @param {boolean} [recalculateColumn = true] - нужно ли пересчитывать колонки для итемов списка
     */
    private updateColumnsSnapshots(offset: number = -1, recalculateColumn: boolean = true): void {
        this._groupsColumnsSnapshot = {};
        this._columnsSnapshot = {
            columns: Array.from({ length: this._columnsCount }, () => []),
            range: [0, this.getSourceCollection().getCount() - 1],
        };
        // Ссылка на последний созданный снимок колонок группы.
        // Используется для заполнения конца диапазона группы.
        let lastGroupSnapshot;
        // Индекс итема относительно группы либо относительно коллекции, если группировка не задана.
        // Используется для вычисления колонки в которой нужно разместить итем.
        let groupItemIndex = -1;
        const groupFunction = this.getGroup();

        this.each((item: T, collectionItemIndex: number) => {
            const collectionItemContent = item.getContents();

            // Если итем это группа, то просто добавляем для неё новый снимок в котором будем
            // хранить какой итем коллекции в какой колонке группы лежит
            if (item['[Controls/_display/GroupItem]']) {
                // При обходе групп нужно сбрасывать индекс, т.к. у каждой группы свои колонки
                // и для вычисления колонки нужен индекс записи относительно группы
                groupItemIndex = -1;
                const groupSnapshot = {
                    columns: Array.from({ length: this._columnsCount }, () => []),
                    range: [collectionItemIndex, collectionItemIndex],
                } as IGroupColumnsSnapshot;

                this._groupsColumnsSnapshot[collectionItemContent as string] = groupSnapshot;

                // При переходе на новую группу нужно обновить
                // конец диапазона у последней созданной группы
                if (!lastGroupSnapshot) {
                    lastGroupSnapshot = groupSnapshot;
                } else {
                    lastGroupSnapshot.range[1] = collectionItemIndex - 1;
                    lastGroupSnapshot = groupSnapshot;
                }

                return;
            }

            // Если итем это данные, то на основании того есть или нет группировка
            // получаем целевой снэпшот в который будем записывать текущее положение
            // итемов в колонках или колонках групп
            let snapshot = this._columnsSnapshot;
            if (groupFunction) {
                const groupId = groupFunction(collectionItemContent, collectionItemIndex, item);
                snapshot = this._groupsColumnsSnapshot[groupId];
            }

            groupItemIndex += 1;
            const column = recalculateColumn
                ? this.setColumnOnItem(item, groupItemIndex)
                : item.getColumn();

            snapshot.columns[column] = snapshot.columns[column] || [];
            snapshot.columns[column].push({ index: collectionItemIndex, key: item.key });
        });

        // При завершении обхода последней группы нужно добить её диапазон
        if (lastGroupSnapshot) {
            lastGroupSnapshot.range[1] = this.getCount() - 1;
        }
    }

    /**
     * Возвращает текущий снимок колонок для переданного итема.
     * Если задана группировка, то снимок вернется для колонок групп,
     * если группировки нет, то в целом для всего списка.
     */
    private getColumnsSnapshotByItem(
        item: T,
        createIfAbsent: boolean = true
    ): IGroupColumnsSnapshot {
        const groupFunction = this.getGroup();

        // Если задана группировка, то брем снэпшот группы
        if (groupFunction) {
            const itemIndex = this.getIndex(item);
            const contents = item.getContents();
            const groupId =
                typeof contents === 'string' ? contents : groupFunction(contents, itemIndex, item);

            // Если для группы итема еще нет снэпшота, то создадим.
            // Т.к. могут добавить итем с новой группой.
            if (!this._groupsColumnsSnapshot[groupId] && createIfAbsent) {
                // Элемент группы также включен в диапазон снэпшота,
                // поэтому, начальный индекс для нового снэпшота будет itemIndex - 1
                this._groupsColumnsSnapshot[groupId] = {
                    columns: [],
                    range: [itemIndex - 1, itemIndex],
                };
            }

            return this._groupsColumnsSnapshot[groupId];
        }

        return this._columnsSnapshot;
    }

    /**
     * Возвращает св-во элемента данных, содержащее индекс колонки,
     * в которую распределен элемент при columnsMode === 'fixed'.
     */
    getColumnProperty(): string {
        return this._$columnProperty;
    }

    getColumnsSnapshot(): IGroupColumnsSnapshot {
        if (this.getGroup()) {
            const columnsSnapshot: IGroupColumnsSnapshot = {
                columns: Array.from({ length: this._columnsCount }, () => []),
                range: [0, this.getSourceCollection().getCount() - 1],
            };
            if (!this._groupsColumnsSnapshot) {
                // обновление до инициализации коллекции. Колонки обновлять невозможно и бессмысленно
                // https://online.sbis.ru/opendoc.html?guid=f3cb6b6f-55f1-4beb-b6f1-aa3152dbb598&client=3
                return null;
            }
            Object.keys(this._groupsColumnsSnapshot).forEach((groupKey) => {
                const groupColumnsSnapshot = this._groupsColumnsSnapshot[groupKey];
                groupColumnsSnapshot.columns.forEach((columnItems, column) => {
                    columnsSnapshot.columns[column].push(...columnItems);
                });
            });
            return columnsSnapshot;
        }
        return this._columnsSnapshot;
    }

    /**
     * Возвращает индекс записи относительно колонки к которой она расположена
     * @param itemCollectionIndex - индекс записи в коллекции
     * @param collectionItem
     */
    getIndexInColumnByIndex(itemCollectionIndex: number, collectionItem?: CollectionItem): number {
        if (itemCollectionIndex === -1) {
            return -1;
        }

        const item = collectionItem || this.at(itemCollectionIndex);
        if (!item) {
            return -1;
        }

        const column = item.getColumn();
        const snapshot = this.getColumnsSnapshotByItem(item);

        let indexInColumn =
            snapshot.columns[column]?.findIndex(
                (itemSnapshot) => itemSnapshot.index === itemCollectionIndex
            ) || 0;

        // Если задана группировка, то индекс в колонке нужно посчитать учитывая все группы
        if (this.getGroup()) {
            const group = this.getGroup()(item.getContents(), itemCollectionIndex, item);
            const groups = this.getGroups();
            const groupIndex = groups.findIndex((it) => {
                return it.key === group;
            });
            for (let index = 0; index < groupIndex; index++) {
                const groupKey = groups[index].key;
                const countItemsInGroup =
                    this._groupsColumnsSnapshot[groupKey].columns[column]?.length || 0;
                indexInColumn += countItemsInGroup;
            }
        }

        return indexInColumn;
    }

    /**
     * Устанавливает название свойства, содержащего ссылку на изображение
     * @param {string} imageProperty Название свойства
     * @void
     */
    setImageProperty(imageProperty: string): void {
        if (imageProperty !== this._$imageProperty) {
            this._$imageProperty = imageProperty;
            this._updateItemsProperty('setImageProperty', this._$imageProperty, 'setImageProperty');
            this._nextVersion();
        }
    }

    /**
     * Возвращает замещающее изображение для случая, когда нет основного
     * @param {string} imageWidthProperty Название свойства
     * @void
     */
    getFallbackImage(): string {
        return this._$fallbackImage;
    }

    /**
     * Устанавливает замещающее изображение для случая, когда нет основного
     * @param {string} imageWidthProperty Название свойства
     * @void
     */
    setFallbackImage(): string {
        return this._$fallbackImage;
    }

    isFirstGroup(groupItem: GroupItem): boolean {
        if (!groupItem) {
            return true;
        }

        const firstGroupWithRenderedItems = this.getGroups().find((group) => {
            const columnsSnapshot = this._groupsColumnsSnapshot[group.key];
            return (
                !group.isExpanded() ||
                columnsSnapshot.columns.find((columnSnapshot, columnIndex) => {
                    const columnRange = this.getColumnRange(columnIndex);
                    return columnSnapshot.find((columnItemSnapshot) => {
                        const columnItemIndex = this.getIndexInColumnByIndex(
                            columnItemSnapshot.index
                        );
                        return (
                            columnItemIndex >= columnRange.startIndex &&
                            columnItemIndex < columnRange.endIndex
                        );
                    });
                })
            );
        });
        return firstGroupWithRenderedItems === groupItem;
    }

    isLastGroup(groupItem: GroupItem): boolean {
        if (!groupItem) {
            return true;
        }

        const groups = this.getGroups();
        return groups[groups.length - 1] === groupItem;
    }

    getGroups(): GroupItem[] {
        return this.getItems().filter((item) => {
            return item['[Controls/_display/GroupItem]'];
        }) as unknown[] as GroupItem[];
    }

    //# region getItemToDirection, using as model[`getItemTo${direction}`]

    getItemToLeft(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (!item || item['[Controls/_display/GroupItem]']) {
            return null;
        }
        const curColumn = item.getColumn();
        const snapshot = this.getColumnsSnapshotByItem(item);
        const curColumnIndex = snapshot.columns[curColumn].findIndex(
            (columnItemSnapshot) => columnItemSnapshot.index === curIndex
        );

        if (curColumn > 0) {
            const prevColumn = snapshot.columns
                .slice()
                .reverse()
                .find((col, index) => {
                    return index > this._$columnsCount - curColumn - 1 && col.length > 0;
                });
            if (prevColumn instanceof Array) {
                newIndex = prevColumn[Math.min(prevColumn.length - 1, curColumnIndex)].index;
            }
        }

        return this.at(newIndex);
    }

    getItemToRight(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number = curIndex;
        if (!item || item['[Controls/_display/GroupItem]']) {
            return null;
        }
        const curColumn = item.getColumn();
        const snapshot = this.getColumnsSnapshotByItem(item);
        const curColumnIndex = snapshot.columns[curColumn].findIndex(
            (columnItemSnapshot) => columnItemSnapshot.index === curIndex
        );

        if (curColumn < this._$columnsCount - 1) {
            const nextColumn = snapshot.columns.find((col, index) => {
                return index > curColumn && col.length > 0;
            });

            if (nextColumn instanceof Array) {
                newIndex = nextColumn[Math.min(nextColumn.length - 1, curColumnIndex)].index;
            }
        }

        return this.at(newIndex);
    }

    getItemToUp(item: T): T {
        const curIndex = this.getIndex(item);
        let newIndex: number;

        const curColumn = item.getColumn();
        const snapshot = this.getColumnsSnapshotByItem(item);
        const curColumnIndex = snapshot.columns[curColumn].findIndex(
            (columnItemSnapshot) => columnItemSnapshot.index === curIndex
        );

        if (curColumnIndex > 0) {
            newIndex = snapshot.columns[curColumn][curColumnIndex - 1].index;
        } else {
            newIndex = curIndex;

            // Если задана группировка и текущая группа итема не является первой,
            // то следующим сверху будет последний итем предыдущей группы
            if (this.getGroup() && snapshot.range[0] > 0) {
                newIndex = snapshot.range[0] - 1;
            }
        }

        return this.at(newIndex);
    }

    getItemToDown(item: T): T {
        let newIndex: number;
        const curIndex = this.getIndex(item);

        const curColumn = item.getColumn();
        const snapshot = this.getColumnsSnapshotByItem(item);
        // Индекс текущей записи относительно колонки в которой она находится
        const curColumnIndex = snapshot.columns[curColumn].findIndex(
            (itemColumnSnapshot) => itemColumnSnapshot.index === curIndex
        );

        // Если текущая запись не последняя в колонке, то берем следующую под ней запись
        if (curColumnIndex < snapshot.columns[curColumn].length - 1) {
            newIndex = snapshot.columns[curColumn][curColumnIndex + 1].index;
        } else {
            newIndex = curIndex;

            // Если задана группировка и текущая группа итема не является последней,
            // то следующим снизу будет первый итем следующей группы
            if (this.getGroup() && snapshot.range[1] < this.getCount()) {
                // snapshot.range[1] это индекс последней записи текущей группы
                // +1 - это запись следующей группы
                // +1 - это первая запись следующей группы
                newIndex = snapshot.range[1] + 2;
            }
        }

        return this.at(newIndex);
    }

    //# endregion

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();

        return (options?: ICollectionItemOptions<S>): T => {
            options.owner = this;
            options.columnProperty = this._$columnProperty;
            options.imageProperty = this._$imageProperty;
            options.fallbackImage = this._$fallbackImage;

            return superFactory.call(this, options);
        };
    }

    setDragPosition(position: IDragPosition<T>): void {
        let draggedItem = null;
        let beforePosition = 0;
        if (position) {
            const strategy = this.getStrategyInstance(
                this._dragStrategy
            ) as unknown as ColumnsDragStrategy<S>;
            draggedItem = strategy.avatarItem;
            beforePosition = this.getIndex(draggedItem);

            const newColumn = position.dispItem.getColumn();
            const curColumn = strategy.avatarItem.getColumn();

            if (position.position !== 'on') {
                if (!this._$autoColumnsRecalculating) {
                    // применяем новый столбец к перетаскиваемому элементу
                    strategy.avatarItem.setColumn(newColumn);

                    if (curColumn !== newColumn) {
                        // корректируем position.position, если сменился столбец, то позиция будет только before
                        position.position = 'before';
                    }
                } else {
                    const newIndex = position.dispItem.index;
                    const curIndex = strategy.avatarItem.index;
                    if (newIndex > curIndex) {
                        position.position = 'after';
                    }
                    if (newIndex < curIndex) {
                        position.position = 'before';
                    }
                }
            }
        }
        super.setDragPosition(position);

        // В режиме авто-пересчета-колонок нужно обновлять реестр при перемещении записи,
        // чтобы после окончания перемещения не было прыжка
        const updateSession = new ColumnsSnapshotUpdatingSession(this, this._notify.bind(this));
        updateSession.start();
        this.updateColumnsSnapshots(-1, this._$autoColumnsRecalculating);
        updateSession.finish();

        if (draggedItem) {
            this._notifyBeforeCollectionChange();
            this._notifyCollectionChange(
                IObservable.ACTION_MOVE,
                [draggedItem],
                this.getIndex(draggedItem),
                [draggedItem],
                beforePosition
            );
            this._notifyAfterCollectionChange();
        }
    }

    resetDraggedItems(): void {
        const strategy = this.getStrategyInstance(
            this._dragStrategy
        ) as unknown as ColumnsDragStrategy<S>;
        const avatarItem = strategy.avatarItem;
        if (this._$autoColumnsRecalculating) {
            super.resetDraggedItems();
        } else {
            this._dragColumn = avatarItem.getColumn();
            super.resetDraggedItems();
            this._dragColumn = null;
        }
    }
}

Object.assign(ColumnsCollection.prototype, {
    '[Controls/_columns/display/Collection]': true,
    SupportNodeFooters: false,
    _moduleName: 'Controls/columns:ColumnsCollection',
    _itemModule: 'Controls/columns:ColumnsCollectionItem',
    _$columnsCount: 2,
    _$maxColumnsCount: null,
    _$columnsMode: 'auto',
    _$autoColumnsRecalculating: false,
    _$itemHeightCallback: null,
    _$columnMinWidth: null,
    _$imageProperty: null,
    _$fallbackImage: null,
    _$leftContainerPadding: null,
    _$rightContainerPadding: null,
});
