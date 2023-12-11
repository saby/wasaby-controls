/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import {
    COUNT_INVISIBLE_ITEMS,
    InvisibleStrategy as TileInvisibleStrategy,
    TileCollectionItem,
} from 'Controls/tile';
import { Model } from 'Types/entity';
import TreeTileCollectionItem, { ITreeTileCollectionItemOptions } from '../TreeTileCollectionItem';
import TreeTileCollection from '../TreeTileCollection';
import InvisibleTreeTileItem from '../InvisibleTreeTileItem';

interface ISortOptions<
    S extends Model = Model,
    T extends TreeTileCollectionItem<S> = TreeTileCollectionItem<S>
> {
    display: TreeTileCollection<S, T>;
    invisibleItems: InvisibleTreeTileItem[];
}

/**
 * Стратегия, которая создает невидимые элементы в иерархической плитке
 * @private
 */
export default class InvisibleStrategy<
    S extends Model = Model,
    T extends TreeTileCollectionItem<S> = TreeTileCollectionItem<S>
> extends TileInvisibleStrategy<S, T> {
    protected _invisibleItems: InvisibleTreeTileItem[];

    protected _createItemsOrder(): number[] {
        return InvisibleStrategy.sortItems<S, T>(this.source.items, {
            display: this.options.display,
            invisibleItems: this._invisibleItems,
        });
    }

    static sortItems<
        S extends Model = Model,
        T extends TreeTileCollectionItem<S> = TreeTileCollectionItem<S>
    >(items: T[], options: ISortOptions<S, T>): number[] {
        const { display } = options;
        const newInvisibleItems = [];
        const insertIndexForNewInvisibleItems = [];
        let shouldProceedLastItem = true;

        function isGroupItem(item: T): boolean {
            return (
                item['[Controls/_display/GroupItem]'] ||
                item['[Controls/_baseTree/BreadcrumbsItem]']
            );
        }

        function isAdditionalItem(item: T): boolean {
            return item['[Controls/_tile/AdditionalTileItem]'];
        }

        function isSearchSeparatorItem(item: T): boolean {
            return item['[Controls/_baseTree/display/RootSeparatorItem]'];
        }

        // Элементы плоской стратегии могут быть группы, доп. элементы, хлебные крошки
        function isPlainItem(item: T): boolean {
            return isGroupItem(item) || isAdditionalItem(item) || isSearchSeparatorItem(item);
        }

        const lastItem = items[items.length - 1];
        const hasLastItem = !!lastItem;
        const lastItemIsPlain = hasLastItem && isPlainItem(lastItem);
        const lastItemIsAdditional = hasLastItem && isAdditionalItem(lastItem);
        const lastItemIsLeaf = hasLastItem && !lastItemIsPlain && !lastItem.isNode();

        for (let i = 0; i < items.length; i++) {
            let itemIndex = i;
            let item = items[i];

            let nextItem = items[i + 1];
            let hasNextItem = !!nextItem;
            let nextItemIsPlain = hasNextItem && isPlainItem(nextItem);
            let nextItemInRoot =
                hasNextItem && !nextItemIsPlain && nextItem.getParent() === display.getRoot();
            while (hasNextItem && !nextItemIsPlain && !nextItemInRoot) {
                i++;
                item = items[i];
                itemIndex = i;
                nextItem = items[i + 1];
                hasNextItem = !!nextItem;
                nextItemIsPlain = hasNextItem && isPlainItem(nextItem);
                nextItemInRoot =
                    hasNextItem && !nextItemIsPlain && nextItem.getParent() === display.getRoot();
            }
            const itemIsNode = !isPlainItem(item) && item.isNode();
            const itemIsLeaf = !isPlainItem(item) && !item.isNode();
            const itemNotInRoot = !isPlainItem(item) && item.getParent() !== display.getRoot();
            // isPlainItem не подходит, т.к. isAdditionalItem тогда не учитывается
            const itemIsTile = !isGroupItem(item) && !isSearchSeparatorItem(item);
            const nextItemIsTile =
                hasNextItem && !isGroupItem(nextItem) && !isSearchSeparatorItem(nextItem);
            const nextItemIsLeaf = hasNextItem && !nextItemIsPlain && !nextItem.isNode();
            const nextItemIsNode = hasNextItem && !nextItemIsPlain && nextItem.isNode();

            // Добавляем невидимые элементы перед группой и разделителем для того, чтобы предшествующие плитки ужались.
            // Если текущая запись - группа, разделитель или хлебная крошка, то не нужно создавать "невиидимые" плитки.
            const addInvisibleBeforePlain = itemIsTile && hasNextItem && !nextItemIsTile;
            // Отделяем узлы от листьев
            // * nextItemIsLeaf && nextItemInRoot - в коллекции могут быть скрытые на основании root итемы, поэтому
            // мы должны убедиться что следующий элемент находится на том же уровне
            // * !hasNextItem - сжимает узлы в любом режиме tileMode
            const addInvisibleToSeparateNodesAndLeaves =
                ((itemIsNode || itemNotInRoot) &&
                    ((nextItemIsLeaf && nextItemInRoot) || !hasNextItem)) ||
                (itemIsLeaf && !itemNotInRoot && nextItemIsNode && nextItemInRoot);

            if (addInvisibleBeforePlain || addInvisibleToSeparateNodesAndLeaves) {
                if (InvisibleStrategy._needCreateInvisibleItems(item, newInvisibleItems)) {
                    newInvisibleItems.push(
                        super._createInvisibleItems(display, item, {
                            isNodeItems: addInvisibleToSeparateNodesAndLeaves || itemIsNode,
                        })
                    );
                } else {
                    newInvisibleItems.push(
                        options.invisibleItems.filter((invisibleItem: InvisibleTreeTileItem) => {
                            return invisibleItem.contents === item.contents;
                        })
                    );
                }
                // invisible-элементы нужно добавлять ПЕРЕД группой и ПОСЛЕ узла
                insertIndexForNewInvisibleItems.push(itemIndex + 1);
                // Если в текущей итерации обновили самый последний элемент в списке, то
                // предотвращаем его повторное обновление блоке ниже.
                if (item === lastItem) {
                    shouldProceedLastItem = false;
                }
            }
        }

        // invisible-элементы после всех элементов нужно добавлять только в режиме static, либо, если есть группировка
        if (shouldProceedLastItem && (display.getTileMode() === 'static' || !!display.getGroup())) {
            if (lastItemIsAdditional || lastItemIsLeaf) {
                if (InvisibleStrategy._needCreateInvisibleItems(lastItem, options.invisibleItems)) {
                    newInvisibleItems.push(
                        super._createInvisibleItems(display, lastItem, {
                            isNodeItems: false,
                        })
                    );
                } else {
                    newInvisibleItems.push(
                        options.invisibleItems.filter((invisibleItem: InvisibleTreeTileItem) => {
                            return invisibleItem.contents === lastItem.contents;
                        })
                    );
                }
                // invisible-элементы нужно добавлять в самый конец
                insertIndexForNewInvisibleItems.push(items.length);
            }
        }

        const itemsOrder = items.map((it, index) => {
            return index + newInvisibleItems.length * COUNT_INVISIBLE_ITEMS;
        });

        options.invisibleItems.length = 0;

        for (let i = 0; i < newInvisibleItems.length; i++) {
            const newItems = newInvisibleItems[i];
            options.invisibleItems.push(...newItems);
            const insertIndex = insertIndexForNewInvisibleItems[i];
            for (let j = 0; j < newItems.length; j++) {
                const invisibleItemIndex = COUNT_INVISIBLE_ITEMS * i + j;
                itemsOrder.splice(insertIndex + invisibleItemIndex, 0, invisibleItemIndex);
            }
        }

        return itemsOrder;
    }

    protected static _getInvisibleItemParams(
        display: TreeTileCollection,
        prevItem: TileCollectionItem,
        options: Partial<ITreeTileCollectionItemOptions>
    ): Partial<ITreeTileCollectionItemOptions> {
        const params = super._getInvisibleItemParams(display, prevItem, options);
        params.itemModule = 'Controls/treeTile:InvisibleTreeTileItem';
        params.node = options.isNodeItems;
        params.parent = display.getRoot();
        params.folderWidth = display.getFolderWidth();
        return params;
    }
}
