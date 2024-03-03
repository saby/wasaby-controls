/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import CollectionItem from '../CollectionItem';
import Collection from '../Collection';
import { mixin } from 'Types/util';
import { DestroyableMixin, Model } from 'Types/entity';
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import { IDragPosition } from 'Controls/_display/interface/IDragPosition';

type TKey = string | number;

interface IOptions<S extends Model, T extends CollectionItem<S>>
    extends IItemsStrategyOptions<S, T> {
    source: IItemsStrategy<S, T>;
    display: Collection<S, T>;

    draggedItemsKeys: TKey[];
    draggableItem?: T;
    targetIndex: number;
}

interface ISortOptions<T extends CollectionItem> {
    targetIndex: number;
    startIndex: number;
    filterMap: boolean[];
    avatarItem: T;
}

export default class Drag<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>>
    extends mixin<DestroyableMixin>(DestroyableMixin)
    implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    protected _options: IOptions<S, T>;

    // "Призрачная" запись, отображается во время перетаскивания
    // вместо самих перетаскиваемых записей
    protected _avatarItem: T;

    // Индекс в стратегии -> индекс который должен быть в результате
    protected _itemsOrder: number[];

    // Список элементов, из которого отфильтрованы перетаскиваемые
    // записи, и в который добавлена призрачная запись
    protected _items: T[];

    private _startDraggableItemIndex: number;

    constructor(options: IOptions<S, T>) {
        super();
        this._isDisplayItem = this._isDisplayItem.bind(this);
        this._options = options;
        this._startDraggableItemIndex = options.targetIndex;
        options.display.addFilter(this._isDisplayItem, null, false);
    }

    get options(): IItemsStrategyOptions<S, T> {
        return this._options;
    }

    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get count(): number {
        return this._getItems().length;
    }

    get items(): T[] {
        const itemsOrder = this._getItemsOrder();
        const items = this._getItems();

        return itemsOrder.map((index) => {
            return items[index];
        });
    }

    get avatarItem(): T {
        return this._avatarItem;
    }

    getDraggedItemsCount(): number {
        return this._options.draggedItemsKeys.length;
    }

    setPosition(newPosition: IDragPosition<T>): void {
        let newIndex: number;

        // Приводим пару параметров index и position к одному - index
        if (this._options.targetIndex < newPosition.index && newPosition.position === 'before') {
            newIndex = newPosition.index - 1;
        } else if (
            this._options.targetIndex > newPosition.index &&
            newPosition.position === 'after'
        ) {
            newIndex = newPosition.index + 1;
        } else {
            newIndex = newPosition.index;
        }

        this._options.targetIndex = newIndex;
        this.invalidate();
    }

    at(index: number): T {
        const itemsOrder = this._getItemsOrder();
        const itemIndex = itemsOrder[index];

        if (itemIndex === undefined) {
            throw new ReferenceError(`Index ${index} is out of bounds.`);
        }

        return this._getItems()[itemIndex];
    }

    getDisplayIndex(index: number): number {
        const sourceIndex = this.source.getDisplayIndex(index);
        return sourceIndex === this._startDraggableItemIndex
            ? this._options.targetIndex
            : sourceIndex;
    }

    getCollectionIndex(index: number): number {
        return this.source.getCollectionIndex(index);
    }

    splice(start: number, deleteCount: number, added: S[] = []): T[] {
        this._itemsOrder = null;

        /*
            Нужно сбрасывать список элементов, чтобы потом из source взять свежие данные, иначе возникает рассинхрон
            Например, дерево - порядок элементов и проставление родитель-ребенок соответствий выполняет AdjacencyList
            и только он должен это делать. То есть когда добавляются элементы, данную логику должен выполнить
            AdjacencyList, а мы у него взять готовые элементы, над которыми сделаем уже свои манипуляции
         */
        this._items = null;

        return this.source.splice(start, deleteCount, added);
    }

    destroy(): void {
        this._options.display.removeFilter(this._isDisplayItem, false);
    }

    reset(): void {
        // не нужно дестроить avatarItem, т.к. он попадает в Tree::onCollectionChange, а там все узлы
        // проверяются на изменения, чтобы эти изменения занотифаить. Задестроенный элемент нельзя проверить.

        this._avatarItem = null;
        this._items = null;
        this._itemsOrder = null;
        return this.source.reset();
    }

    invalidate(): void {
        this._itemsOrder = null;
        // нужно сбросить items, чтобы взять актуальные у source
        this._items = null;
        return this.source.invalidate();
    }

    protected _getItemsOrder(): number[] {
        if (!this._itemsOrder) {
            this._itemsOrder = this._createItemsOrder();
        }
        return this._itemsOrder;
    }

    protected _getItems(): T[] {
        if (!this._items) {
            this._items = this._createItems();
        }
        return this._items;
    }

    protected _createItemsOrder(): number[] {
        const items = this._getItems();
        // filterMap нельзя передавать один раз через опции, т.к. во время перетаскивания он может измениться.
        // Например, развернули узел. Через метод getFilterMap мы всегда получим актуальный filterMap
        return Drag.sortItems<S, T>(items, {
            targetIndex: this._options.targetIndex,
            filterMap: this._options.display.getFilterMap(),
            startIndex: this._startDraggableItemIndex,
            avatarItem: this._avatarItem,
        });
    }

    protected _createItems(): T[] {
        // Если не передали перетаскиваемый элемент, то не нужно создавать "призрачный" элемент
        if (!this._avatarItem && this._options.draggableItem) {
            this._avatarItem = this._createAvatarItem();
        }

        const items = this.source.items;
        if (this._avatarItem) {
            // записи могло не быть в изначальном списке, если перемещение между списками.
            const index = items.findIndex((it) => {
                return it.key === this._avatarItem.key;
            });
            if (index !== -1) {
                this._startDraggableItemIndex = index;
            }
            // Заменяем оригинальный перетаскиваемый элемент на "призрачный" элемент
            items.splice(this._startDraggableItemIndex, 1, this._avatarItem);
        }
        return items;
    }

    protected _getProtoItem(): T {
        return this._options.draggableItem;
    }

    protected _createAvatarItem(): T {
        const protoItem = this._getProtoItem();
        return this._createItem(protoItem);
    }

    protected _createItem(protoItem: T): T {
        const item = this.options.display.createItem({
            contents: protoItem?.getContents(),
        });
        if (item && protoItem) {
            item.setRoundBorder({
                tl:
                    item.getTopLeftRoundBorder() !== 'default'
                        ? item.getTopLeftRoundBorder()
                        : 'xs',
                tr:
                    item.getTopRightRoundBorder() !== 'default'
                        ? item.getTopRightRoundBorder()
                        : 'xs',
                bl:
                    item.getBottomLeftRoundBorder() !== 'default'
                        ? item.getBottomLeftRoundBorder()
                        : 'xs',
                br:
                    item.getBottomRightRoundBorder() !== 'default'
                        ? item.getBottomRightRoundBorder()
                        : 'xs',
            });
            item.setDragged(true, true);
            item.setMarked(protoItem.isMarked(), true);
            item.setSelected(protoItem.isSelected(), true);
        }
        return item;
    }

    protected _isDisplayItem(item: Model, index: number, collectionItem: CollectionItem): boolean {
        const draggedItemsKeys = this._options.draggedItemsKeys;

        if (!collectionItem.DraggableItem) {
            if (collectionItem['[Controls/_display/GroupItem]']) {
                const items = this.items;
                const groupIndex = index;
                const nextGroupIndex = items.findIndex((it, i) => {
                    return i > index && it['[Controls/_display/GroupItem]'];
                });
                const endIndex = nextGroupIndex !== -1 ? nextGroupIndex : items.length;
                const groupChilds = items.slice(groupIndex + 1, endIndex);
                const groupHasNotDraggedItem = groupChilds.find((it) => {
                    return !draggedItemsKeys.includes(it.key);
                });
                // Если у группы все записи перетаскиваются, то скрываем и группу.
                return !!groupHasNotDraggedItem;
            } else {
                return true;
            }
        }

        const itemIsDraggable = draggedItemsKeys.includes(collectionItem.key);
        // Проверяем key, т.к. CollectionItem будет пересоздан(avatarItem)
        const startDraggableItemKey =
            this._options.draggableItem && this._options.draggableItem.key;
        const itemIsStartDraggableItem = startDraggableItemKey === collectionItem.key;
        return !itemIsDraggable || itemIsStartDraggableItem;
    }

    static sortItems<S extends Model = Model, T extends CollectionItem<S> = CollectionItem<S>>(
        items: T[],
        options: ISortOptions<T>
    ): number[] {
        const itemsCount = items.length;
        if (!itemsCount) {
            return [];
        }
        if (itemsCount === 1) {
            // Если элемент остается один, то есть только единственный вариант itemsOrder
            return [0];
        }

        const itemsOrder = new Array(itemsCount);
        for (let i = 0; i < itemsCount; i++) {
            itemsOrder[i] = i;
        }

        if (options.avatarItem) {
            // targetIndex и startIndex не могут быть больше itemsCount.
            // Это может произойти, например, если выделили несколько записей в конце списка и потащили за последнюю,
            // тогда перетаскиваемые записи скроются, но индексы были посчитаны до скрытия и будут указывать за пределы.
            const targetIndex =
                options.targetIndex < itemsCount
                    ? this._getIndexGivenFilter(options.targetIndex, options.filterMap)
                    : itemsCount - 1;
            const startIndex =
                options.startIndex < itemsCount ? options.startIndex : itemsCount - 1;

            itemsOrder.splice(startIndex, 1);
            itemsOrder.splice(targetIndex, 0, startIndex);
        }

        return itemsOrder;
    }

    /**
     * Возвращает индекс перетаскиваемой записи, учитывая скрытые записи
     *
     * Что видит контроллер(и пользователь):
     *  0 Запись0 true
     *  1 Запись3 true
     *  2 Запись6 true
     *  3 Запись7 true
     *
     * Как это выглядит внутри списка:
     *  0 Запись0 true
     *  1 Запись1 false
     *  2 Запись2 false
     *  3 Запись3 true
     *  4 Запись4 false
     *  5 Запись5 false
     *  6 Запись6 true
     *  7 Запись7 true
     *
     *  Нам нужно привести индексы к внутрисписочным.
     *  Для этого мы из filterMap получаем следущий массив:
     *  0 0 Запись0 true
     *  1 3 Запись3 true
     *  2 6 Запись6 true
     *  3 7 Запись7 true
     *
     *  И по sourceIndex олучаем правильный индекс записи.
     *
     * @param sourceIndex
     * @param filterMap
     * @private
     */
    private static _getIndexGivenFilter(sourceIndex: number, filterMap: boolean[]): number {
        const visibleItems: { index: number; visible: boolean }[] = [];

        filterMap.forEach((visible, index) => {
            if (visible) {
                visibleItems.push({ index, visible });
            }
        });

        const visibleItem = visibleItems[sourceIndex];
        return visibleItem ? visibleItem.index : 0;
    }
}
