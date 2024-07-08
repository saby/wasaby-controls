/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { DestroyableMixin, SerializableMixin, ISerializableState, Model } from 'Types/entity';
import { mixin, object } from 'Types/util';
import { Map } from 'Types/shim';
import { create } from 'Types/di';
import BreadcrumbsItem from '../BreadcrumbsItem';
import Search from '../Search';
import TreeItemDecorator from '../TreeItemDecorator';
import TreeItem from '../TreeItem';
import { IItemsStrategy, IItemsStrategyOptions } from 'Controls/display';

const FORGET_TIMEOUT = 1000;
let lastTimeForget = 0;

interface IOptions<S, T> {
    /**
     * Имя свойства элемента хлебных крошек, хранящее признак того, что этот элемент и путь до него должны быть
     * выделены в обособленную цепочку
     */
    dedicatedItemProperty?: string;

    source: IItemsStrategy<S, T>;

    treeItemDecoratorModule: string;
}

interface ISortOptions<S extends Model, T extends TreeItem<S>> {
    treeItemToDecorator: Map<T, TreeItemDecorator<S>>;
    treeItemToBreadcrumbs: Map<T, BreadcrumbsItem<S>>;
    dedicatedItemProperty: string;
    display: Search<S, T>;

    treeItemDecoratorModule: string;
}

interface IBreadCrumbsReference<S extends Model, T extends TreeItem<S>> {
    breadCrumbs: BreadcrumbsItem<S>;
    last: T;
    itsNew: boolean;
}

/**
 * Returns nearest parent node for given tree item. It could be item itself.
 * @param item Started node or leaf to go from
 */
function getNearestNode<S extends Model, T extends TreeItem<S>>(item: T): T {
    if (!item || !item.isNode) {
        return item;
    }

    if (item.isNode()) {
        return item;
    }

    const parent = item.getParent() as T;
    if (!parent) {
        return item;
    }

    return getNearestNode(parent);
}

/**
 * Returns breadcrumbs reference for given tree item
 * @param item Item to detect breadcrumbs reference to
 * @param treeItemToBreadcrumbs Tree item to breadcrumbs map
 * @param breadcrumbsToData Breadcrumbs to data map
 * @param display Related display
 */
function getBreadCrumbsReference<S extends Model, T extends TreeItem<S>>(
    item: T,
    treeItemToBreadcrumbs: Map<T, BreadcrumbsItem<S>>,
    breadcrumbsToData: Map<BreadcrumbsItem<S>, T[]>,
    display: Search<S, T>
): IBreadCrumbsReference<S, T> {
    let breadCrumbs;
    const last = getNearestNode(item);
    const root = display.getRoot();
    if (last && last !== root && !last['[Controls/treeGrid:TreeGridGroupDataRow]']) {
        breadCrumbs = treeItemToBreadcrumbs.get(last);
        if (!breadCrumbs) {
            // Родителем хлебной крошки всегда является корневой узел, т.к. хлебная крошка это путь до корневого узла
            // В случае, когда группой является узел, то родителем хлебной крошки должна быть эта группа
            const parent =
                item.getParent() && item.getParent()['[Controls/treeGrid:TreeGridGroupDataRow]']
                    ? item.getParent()
                    : root;
            breadCrumbs = display.createBreadcrumbsItem({
                contents: null,
                last,
                parent,
            });

            treeItemToBreadcrumbs.set(last, breadCrumbs);
        }
    }

    const itsNew = !breadcrumbsToData.has(breadCrumbs);

    return { breadCrumbs, last, itsNew };
}

/**
 * Strategy-decorator which supposed to join expanded nodes into one element.
 * @class Controls/_display/ItemsStrategy/Search
 * @mixes Types/entity:DestroyableMixin
 *
 * @mixes Types/entity:SerializableMixin
 * @private
 */
export default class SearchStrategy<S extends Model, T extends TreeItem<S> = TreeItem<S>>
    extends mixin<DestroyableMixin, SerializableMixin>(DestroyableMixin, SerializableMixin)
    implements IItemsStrategy<S, T>
{
    get options(): IItemsStrategyOptions<S, T> {
        return this.source.options;
    }

    get source(): IItemsStrategy<S, T> {
        return this._options.source;
    }

    get count(): number {
        return this._getItems().length;
    }

    get items(): T[] {
        return this._getItems() as T[];
    }
    /**
     * Constructor options
     */
    protected _options: IOptions<S, T>;

    /**
     * Map from leaf to its decorator: TreeItem -> TreeItemDecorator
     */
    protected _treeItemToDecorator: Map<T, TreeItemDecorator<S>> = new Map<
        T,
        TreeItemDecorator<S>
    >();

    /**
     * Map from node to its breadcrumbs: TreeItem -> BreadcrumbsItem
     */
    protected _treeItemToBreadcrumbs: Map<T, BreadcrumbsItem<S>> = new Map<T, BreadcrumbsItem<S>>();

    // region IItemsStrategy

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

    constructor(options: IOptions<S, T>) {
        super();
        this._options = options;
    }

    destroy(): void {
        super.destroy();
        this._treeItemToDecorator = null;
        this._treeItemToBreadcrumbs = null;
    }

    at(index: number): T {
        return this._getItems()[index] as T;
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        return this.source.reset();
    }

    invalidate(): void {
        return this.source.invalidate();
    }

    getDisplayIndex(index: number): number {
        const sourceIndex = this.source.getDisplayIndex(index);
        const sourceItem = this.source.items[sourceIndex];
        const mappedItem =
            this._treeItemToDecorator.get(sourceItem) ||
            this._treeItemToBreadcrumbs.get(sourceItem) ||
            sourceItem;
        const items = this._getItems();
        const itemIndex = items.indexOf(mappedItem as T);

        return itemIndex === -1 ? items.length : itemIndex;
    }

    getCollectionIndex(index: number): number {
        const items = this._getItems();
        const mappedItem = items[index];
        const item = mappedItem['[Controls/_baseTree/TreeItemDecorator]']
            ? mappedItem.getSource()
            : mappedItem;
        const sourceIndex = this.source.items.indexOf(item as T);

        return sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;
    }

    // endregion

    // region SerializableMixin

    _getSerializableState(state: ISerializableState): ISerializableState {
        const resultState = SerializableMixin.prototype._getSerializableState.call(this, state);
        resultState.$options = this._options;
        return resultState;
    }

    // endregion

    // region Protected

    /**
     * Returns elements of display
     * @protected
     */
    protected _getItems(): (T | BreadcrumbsItem<S>)[] {
        return SearchStrategy.sortItems<S, T>(this.source.items, {
            dedicatedItemProperty: this._options.dedicatedItemProperty || '',
            treeItemToDecorator: this._treeItemToDecorator,
            treeItemToBreadcrumbs: this._treeItemToBreadcrumbs,
            display: this.options.display as Search<S, T>,
            treeItemDecoratorModule: this._options.treeItemDecoratorModule,
        });
    }

    // endregion

    // region Statics

    /**
     * Returns items in sorted order and by the way joins nodes into breadcrumbs.
     * @param items Display items
     * @param options Options
     */
    static sortItems<S extends Model, T extends TreeItem<S> = TreeItem<S>>(
        items: T[],
        options: ISortOptions<S, T>
    ): (T | BreadcrumbsItem<S>)[] {
        const {
            dedicatedItemProperty,
            display,
            treeItemToDecorator,
            treeItemToBreadcrumbs,
        }: ISortOptions<S, T> = options;
        const breadcrumbsToData = new Map<BreadcrumbsItem<S>, T[]>();
        const sortedItems = [];

        /**
         * Adds found breadcrumbs to the result list
         * @param reference Breadcrumbs reference
         */
        function addBreadCrumbsItself(reference: IBreadCrumbsReference<S, T>): void {
            breadcrumbsToData.set(reference.breadCrumbs, []);
            sortedItems.push(reference.breadCrumbs);
        }

        /**
         * Adds a member to the found breadcrumbs
         * @param reference Breadcrumbs reference
         * @param item The member to add
         */
        function addBreadCrumbsMember(reference: IBreadCrumbsReference<S, T>, item: T): void {
            const data = breadcrumbsToData.get(reference.breadCrumbs);
            if (data) {
                data.push(item);
            } else {
                sortedItems.push(item);
            }
        }

        let prevBreadCrumbs;
        items.forEach((item, index) => {
            let resultItem = item;

            if (
                item &&
                item['[Controls/_display/TreeItem]'] &&
                !item['[Controls/treeGrid:TreeGridNodeFooterRow]'] &&
                !item['[Controls/treeGrid:TreeGridNodeHeaderRow]'] &&
                !item['[Controls/treeGrid:TreeGridGroupDataRow]']
            ) {
                if (item.isNode()) {
                    // Check if there is a special item within the breadcrumbs
                    if (
                        dedicatedItemProperty &&
                        object.getPropertyValue(item.getContents(), dedicatedItemProperty)
                    ) {
                        // Add completed breadcrumbs for dedicated items
                        const dedicatedBreadcrumbsReference = getBreadCrumbsReference(
                            item,
                            treeItemToBreadcrumbs,
                            breadcrumbsToData,
                            display
                        );
                        prevBreadCrumbs = dedicatedBreadcrumbsReference.breadCrumbs;
                        addBreadCrumbsItself(dedicatedBreadcrumbsReference);

                        // Finish here for dedicated items
                        return;
                    }

                    // Look at the next item after current node
                    const next = items[index + 1];
                    const nextIsTreeItem = next && next['[Controls/_display/TreeItem]'];

                    // Check that the next tree item is a node with bigger level.
                    // If it's not that means we've reached the end of current breadcrumbs.
                    const isLastBreadcrumb =
                        nextIsTreeItem && next.isNode() ? item.getLevel() >= next.getLevel() : true;

                    // Add completed breadcrumbs to show even empty
                    if (isLastBreadcrumb) {
                        const lastNodeBreadcrumbsReference = getBreadCrumbsReference(
                            item,
                            treeItemToBreadcrumbs,
                            breadcrumbsToData,
                            display
                        );
                        prevBreadCrumbs = lastNodeBreadcrumbsReference.breadCrumbs;
                        addBreadCrumbsItself(lastNodeBreadcrumbsReference);
                    }

                    // Finish here for any node
                    return;
                }

                const parent = item.getParent() as T;
                // Get breadcrumbs by leaf's parent
                const breadcrumbsReference: IBreadCrumbsReference<S, T> = getBreadCrumbsReference(
                    parent,
                    treeItemToBreadcrumbs,
                    breadcrumbsToData,
                    display
                );

                const currentBreadcrumbs = breadcrumbsReference.breadCrumbs;
                if (currentBreadcrumbs) {
                    // Add actual breadcrumbs if it has been changed and it's not a repeat
                    if (currentBreadcrumbs !== prevBreadCrumbs && breadcrumbsReference.itsNew) {
                        addBreadCrumbsItself(breadcrumbsReference);
                    }

                    // This is a leaf outside breadcrumbs so set the current breadcrumbs as its parent.
                    // All leaves outside breadcrumbs should be at the next level after breadcrumbs itself.
                    let decoratedItem = treeItemToDecorator.get(item);
                    if (!decoratedItem) {
                        // Descendants of leaves should keep their level so that check the parent match and keep
                        // the level by set the origin as parent if necessary
                        const itsDescendant = item.getParent() !== breadcrumbsReference.last;

                        let parentLocal;
                        if (itsDescendant) {
                            parentLocal = item.getParent();
                        } else {
                            parentLocal = currentBreadcrumbs;
                        }

                        decoratedItem = create(options.treeItemDecoratorModule, {
                            source: item,
                            parent: parentLocal,
                            multiSelectVisibility: display.getMultiSelectVisibility(),
                            multiSelectAccessibilityProperty:
                                display.getMultiSelectAccessibilityProperty(),
                        });
                        treeItemToDecorator.set(item, decoratedItem);
                    }
                    resultItem = decoratedItem as unknown as T;

                    // Treat only resolved breadcrumbs as previous
                    prevBreadCrumbs = currentBreadcrumbs;

                    addBreadCrumbsMember(breadcrumbsReference, resultItem);

                    // Finish here if breadcrumbs found
                    return;
                }
            }

            // Just map an item not referred to any breadcrumbs
            sortedItems.push(resultItem);
        });

        // Clean unused instances up from time to time
        if (Date.now() - lastTimeForget > FORGET_TIMEOUT) {
            lastTimeForget = Date.now();

            // Forget unused leaf decorators
            const decoratorsToDelete = [];
            treeItemToDecorator.forEach((value, key) => {
                if (items.indexOf(key) === -1) {
                    decoratorsToDelete.push(key);
                }
            });
            decoratorsToDelete.forEach((key) => {
                return treeItemToDecorator.delete(key);
            });

            // Forget unused breadcrumbs
            const breadcrumbsToDelete = [];
            treeItemToBreadcrumbs.forEach((value, key) => {
                if (items.indexOf(key) === -1) {
                    breadcrumbsToDelete.push(key);
                }
            });
            breadcrumbsToDelete.forEach((key) => {
                return treeItemToBreadcrumbs.delete(key);
            });
        }

        // Expand breadcrumbs into flat array
        const resultItems: (T | BreadcrumbsItem<S>)[] = [];
        sortedItems.forEach((item) => {
            if (item['[Controls/_baseTree/BreadcrumbsItem]']) {
                resultItems.push(item);
                const data = breadcrumbsToData.get(item);
                if (data) {
                    resultItems.push(...data);
                }
            } else {
                resultItems.push(item);
            }
        });

        return resultItems;
    }

    // endregion
}

Object.assign(SearchStrategy.prototype, {
    '[Controls/_display/itemsStrategy/Search]': true,
    _moduleName: 'Controls/display:itemsStrategy.Search',
    _treeItemToDecorator: null,
    _treeItemToBreadcrumbs: null,
});
