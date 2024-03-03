/**
 * @kaizen_zone 76d0517f-7dae-4c08-9a57-f5b6e1cc9bfe
 */
import { IOptions, TVisibility, Visibility, TDirection } from './interface';
import { Collection, CollectionItem } from 'Controls/display';
import {
    CompatibleSingleColumnMarkerStrategy as SingleColumnStrategy,
    IMarkerStrategy,
} from 'Controls/markerListAspect';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import type { TreeCollection, TreeItem } from 'Controls/tree';
/**
 * Контроллер управляющий маркером в списке
 * @private
 */
export class Controller {
    protected _model: Collection<Model, CollectionItem<Model>>;
    private _markerVisibility: TVisibility;
    private _markedKey: CrudEntityKey;
    private _markerStrategy: IMarkerStrategy;

    constructor(options: IOptions) {
        const markerStrategy = options.markerStrategy || SingleColumnStrategy;
        this._markerStrategy = new markerStrategy({
            moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
        }) as IMarkerStrategy;
        this._model = options.model;
        this._markerVisibility = options.markerVisibility;
        this._markedKey = options.markedKey;

        if (this._markedKey !== null && this._markedKey !== undefined) {
            this._model.setMarkedKey(this._markedKey);
        }
    }

    /**
     * Обновляет состояние контроллера
     * @param {IOptions} options Новые опции
     * @void
     */
    updateOptions(options: Partial<IOptions>): void {
        if (this._model !== options.model) {
            this._model = options.model;

            // Мы должны восстановить маркер в новой модели
            this.setMarkedKey(this.getMarkedKey());
        }

        if (this._markerVisibility !== options.markerVisibility) {
            this._markerVisibility = options.markerVisibility;
            if (this._markerVisibility === 'hidden') {
                this.setMarkedKey(null);
            }
        }
        const markerStrategy = options.markerStrategy || SingleColumnStrategy;
        this._markerStrategy = new markerStrategy({
            moveMarkerOnScrollPaging: options.moveMarkerOnScrollPaging,
        }) as IMarkerStrategy;
        this._markerVisibility = options.markerVisibility;
    }

    /**
     * Применяет переданный ключ
     * @param {CrudEntityKey} key Новый ключ
     * @void
     */
    setMarkedKey(key: CrudEntityKey): void {
        this._model.setMarkedKey(key);
        this._markedKey = key;
    }

    /**
     * Высчитывает новый ключ маркера
     * @return {CrudEntityKey} Новый ключ
     */
    calculateMarkedKeyForVisible(): CrudEntityKey {
        // TODO удалить этот метод, когда избавимся от onactivated
        let newMarkedKey = this._markedKey;
        const item = this._model.getItemBySourceKey(this._markedKey);
        if (
            this._markerVisibility === Visibility.Visible &&
            this._model.getCount() &&
            (!item || !item.Markable)
        ) {
            newMarkedKey = this._getFirstItemKey() as CrudEntityKey;
        }

        return newMarkedKey;
    }

    /**
     * Возвращает текущий ключ маркера
     * @return {CrudEntityKey} Текущий ключ
     */
    getMarkedKey(): CrudEntityKey {
        return this._markedKey;
    }

    /**
     * Высчитывает ключ следующего элемента
     * @return {CrudEntityKey} Ключ следующего элемента
     */
    getNextMarkedKey(): CrudEntityKey | void {
        const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
        const nextMarkedKey = this._markerStrategy.oldGetNextMarkedKey(this._model, index + 1);
        return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
    }

    getMarkedKeyByDirection(direction: TDirection): CrudEntityKey | void {
        if (this._markedKey === undefined || this._markedKey === null) {
            return this._getFirstItemKey();
        }

        const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
        const nextMarkedKey = this._markerStrategy.oldGetMarkedKeyByDirection(
            this._model,
            index,
            direction
        );
        return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
    }

    /**
     * Высчитывает ключ предыдущего элемента
     * @return {CrudEntityKey} Ключ предыдущего элемента
     */
    getPrevMarkedKey(): CrudEntityKey | void {
        const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
        const prevMarkedKey = this._markerStrategy.oldGetPrevMarkedKey(this._model, index - 1);
        return prevMarkedKey === null ? this._markedKey : prevMarkedKey;
    }

    /**
     * Возвращает ключ следующего подходящего для установки маркера элемента
     * по текущему элементу.
     * Если текущий элемент подходит, для установки маркера то возвращает его ключ.
     * @remark
     * Метод необходим для случаев, когда мы пытаемся установить маркер на новый элемент,
     * но мы не знаем, является ли этот элемент Markable
     * @param item
     * @return {CrudEntityKey} Ключ следующего подходящего для установки маркера элемента
     */
    getSuitableMarkedKey(item: CollectionItem<Model>) {
        if (item.Markable) {
            return item.key;
        }
        const index = this._model.getIndex(item);
        const nextMarkedKey = this._markerStrategy.oldGetNextMarkedKey(this._model, index);
        return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
    }

    /**
     * Обрабатывает удаления элементов из коллекции
     * @remark Возвращает ключ следующего элемента, при его отустствии предыдущего, иначе null
     * @param {number} removedItemsIndex Индекс удаленной записи в коллекции
     * @param {Array<CollectionItem<Model>>} removedItems Удаленные элементы коллекции
     * @return {CrudEntityKey} Новый ключ маркера
     */
    onCollectionRemove(
        removedItemsIndex: number,
        removedItems: CollectionItem<Model>[]
    ): CrudEntityKey {
        // Событие remove срабатывает также при скрытии элементов.
        // Когда элементы скрываются, например при сворачивании группы, у них сохраняется свое состояние.
        // После скрытия элементов маркер переставляется или сбрасывается,
        // поэтому на скрытых элементах нужно сбросить состояние marked
        removedItems.forEach((item) => {
            return item.Markable && item.setMarked(false, true);
        });

        const removedMarkedItem = removedItems.find((it) => {
            return it.Markable && it.key === this._markedKey;
        });
        if (!removedMarkedItem) {
            return this._markedKey;
        }

        let markedKeyAfterRemove = this._getMarkedKeyAfterRemove(
            removedMarkedItem,
            removedItemsIndex
        );

        // Если свернули узел внутри которого есть маркер, то маркер нужно поставить на узел
        // TODO нужно только для дерева, можно подумать над наследованием
        if (
            removedItems[0] &&
            removedItems[0]['[Controls/_display/TreeItem]'] &&
            this._markedKey !== undefined &&
            this._markedKey !== null
        ) {
            const parent = (removedItems[0] as unknown as TreeItem).getParent();
            // На корневой узел ставить маркер нет смысла, т.к. в этом случае
            // должно отработать именно удаление элементов, а не скрытие
            // isExpanded() проверяет, что случилось именно сворачивание родительского узла
            if (
                parent &&
                parent !== (this._model as unknown as TreeCollection).getRoot() &&
                parent.Expandable &&
                !parent.isExpanded() &&
                parent.Markable
            ) {
                markedKeyAfterRemove = parent.key;
            }
        }

        return markedKeyAfterRemove;
    }

    /**
     * Обрабатывает добавление элементов в коллекцию
     * @param {Array<CollectionItem<Model>>} items Список добавленных элементов
     * @void
     */
    onCollectionAdd(items: CollectionItem<Model>[]): void {
        // Если элемент был скрыт, то сработает remove и с элемента уберется выделение,
        // а при показе элемента сработает add и для элемента нужно восстановить выделение,
        // если текущий markedKey указывает на него
        if (this._containsMarkedItem(items)) {
            this.setMarkedKey(this._markedKey);
        }
    }

    /**
     * Обрабатывает замену элементов в коллекции
     * @param {Array<CollectionItem<Model>>} items Список добавленных элементов
     * @void
     */
    onCollectionReplace(items: CollectionItem<Model>[]): void {
        // Если Record заменили, например, через метод RecordSet.replace, то в таком случае создается новый
        // CollectionItem без состояния и для него нужно восстановить маркер
        // https://online.sbis.ru/doc/03a1208c-96ef-4641-bda8-fa7c72f6ebfb
        this._restoreMarker(items);
    }

    onCollectionChange(items: CollectionItem[]): void {
        this._restoreMarker(items);
    }

    /**
     * Обрабатывает замену элементов в коллекции
     * @return {CrudEntityKey} Новый ключ маркера
     */
    onCollectionReset(): CrudEntityKey {
        let newMarkedKey = this._markedKey;
        // при ресете маркер пересчитаем, только когда маркер всегда виден или виден по активации и маркер был до ресета
        const needRecalculateMarker =
            this._markerVisibility === Visibility.Visible ||
            (this._markerVisibility === Visibility.OnActivated &&
                this._markedKey !== null &&
                this._markedKey !== undefined);
        if (
            needRecalculateMarker &&
            this._model.getCount() &&
            !this._model.getItemBySourceKey(this._markedKey)
        ) {
            newMarkedKey = this._getFirstItemKey() as CrudEntityKey;
        }
        if (newMarkedKey === this._markedKey) {
            this.setMarkedKey(newMarkedKey);
        }
        return newMarkedKey;
    }

    shouldMoveMarkerOnScrollPaging(): boolean {
        return this._markerStrategy.shouldMoveMarkerOnScrollPaging();
    }

    /**
     * Зануляет все ссылки внутри контроллера
     * @void
     */
    destroy(): void {
        this._model.each((it) => {
            return it.Markable && it.setMarked(false, true);
        });
        this._markedKey = null;
        this._markerVisibility = null;
        this._model = null;
    }

    private _restoreMarker(items: CollectionItem[]): void {
        if (this._containsMarkedItem(items)) {
            this.setMarkedKey(this._markedKey);
        }
    }

    private _getKey(item: CollectionItem): CrudEntityKey {
        return item.Markable ? item.key : null;
    }

    /**
     * Возвращает ключ ближайшего следующего элемента, если нет следующего, то предыдущего, а иначе null
     * @param index Индекс элемента, к которому искать ближайший элемент
     * @private
     */
    private _calculateNearbyItemKey(index: number): CrudEntityKey {
        // Считаем ключ следующего элемента
        let newMarkedKey = this._markerStrategy.oldGetNextMarkedKey(this._model, index);

        // Считаем ключ предыдущего элемента, если следующего нет
        if (newMarkedKey === null) {
            newMarkedKey = this._markerStrategy.oldGetPrevMarkedKey(this._model, index);
        }

        return newMarkedKey;
    }

    // Для дерева необходим особый расчёт маркированной записи.
    // Это надо выносить в отдельную стратегию.
    private _calculateTreeNearbyItemKey(removedItem: CollectionItem, index: number): CrudEntityKey {
        // Считаем ключ следующего элемента
        let newMarkedKey = this._markerStrategy.oldGetNextMarkedKey(this._model, index);

        // Если следующего нет, то берем ключ предыдущего элемента
        if (newMarkedKey === null) {
            newMarkedKey = this._markerStrategy.oldGetPrevMarkedKey(this._model, index);
        } else if (
            // Если родитель нового маркируемого элемента отличается от родителя удаленного маркированного элемента,
            // то берем элемент, находящийся перед удалённым
            // https://online.sbis.ru/opendoc.html?guid=0129fd05-eb52-4105-b239-4335ecab918f&client=3
            // Искать нужно без фильтра, по списочной коллекции, потому что при массовом удалении
            // в исходной коллекции уже может не быть данных.
            // https://online.sbis.ru/opendoc.html?guid=3507b6de-43b9-436b-8bb8-979f4ca3dbaf&client=3
            (removedItem as unknown as TreeItem).getParent() !==
                (this._model as unknown as TreeCollection).getRoot() &&
            (removedItem as unknown as TreeItem).getParent() !==
                (
                    this._model.getItemBySourceKey(newMarkedKey, false) as unknown as TreeItem
                ).getParent()
        ) {
            newMarkedKey = this._markerStrategy.oldGetPrevMarkedKey(this._model, index - 1);
        }

        return newMarkedKey;
    }

    /**
     * Возвращает ключ первого элемента модели
     * @private
     */
    private _getFirstItemKey(): CrudEntityKey | void {
        if (!this._model.getCount()) {
            return null;
        }

        const markableItem = this._model.getFirst('Markable');
        return markableItem?.key;
    }

    private _getMarkedKeyAfterRemove(
        removedItem: CollectionItem,
        removedIndex: number
    ): CrudEntityKey {
        // Если элемент с текущем маркером не удален или маркер не проставлен, то маркер не нужно менять
        const item = this._model.getItemBySourceKey(this._markedKey);
        if (item || this._markedKey === null || this._markedKey === undefined) {
            return this._markedKey;
        }
        return this._model['[Controls/_display/Tree]']
            ? this._calculateTreeNearbyItemKey(removedItem, removedIndex)
            : this._calculateNearbyItemKey(removedIndex);
    }

    private _containsMarkedItem(items: CollectionItem<Model>[]): boolean {
        return items.some((item) => {
            return this._getKey(item) === this._markedKey;
        });
    }
}
