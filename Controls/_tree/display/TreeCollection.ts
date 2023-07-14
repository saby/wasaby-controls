/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { mixin } from 'Types/util';
import TreeItem, { IOptions as ITreeItemOptions } from './TreeItem';
import { CollectionItem, ItemsFactory } from 'Controls/display';
import { Tree, ITreeCollectionOptions } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

export interface IOptions<S extends Model, T extends TreeItem<S>>
    extends ITreeCollectionOptions<S, T> {
    nodeTypeProperty?: string;
}

/**
 * Рекурсивно проверяет скрыт ли элемент сворачиванием родительских узлов
 * @param {TreeItem<T>} item
 */
function itemIsVisible<T extends Model>(item: TreeItem<T>): boolean {
    if (item['[Controls/_display/GroupItem]'] || item['[Controls/_baseTree/BreadcrumbsItem]']) {
        return true;
    }

    const parent = item.getParent();
    // корневой узел не может быть свернут
    if (!parent || parent['[Controls/_baseTree/BreadcrumbsItem]'] || parent.isRoot()) {
        return true;
    } else if (!parent.isExpanded()) {
        return false;
    }

    return itemIsVisible(parent);
}

export default class TreeCollection<
    S extends Model,
    T extends TreeItem<S> = TreeItem<S>
> extends mixin<Tree<any>>(Tree) {
    readonly '[Controls/tree:TreeCollection]': boolean;

    protected _getCollectionFilter(): ReturnType<Tree['_getCollectionFilter']> {
        return (contents, sourceIndex, item) => {
            return itemIsVisible(item as T);
        };
    }

    // region override

    isLastItem(item: CollectionItem): boolean {
        // TODO Сделать возможным делать последний NodeFooter last, если он содержит данные
        //  Как можно проверить из кода - не ясно
        const enumerator = this._getUtilityEnumerator();

        // определяем через enumerator последнюю запись перед NodeFooter и её индекс
        enumerator.setPosition(this.getCount() - 1);
        let resultItemIndex = enumerator.getCurrentIndex();
        let resultItem = enumerator.getCurrent();
        while (resultItem && resultItem['[Controls/tree:TreeNodeFooterItem]']) {
            enumerator.movePrevious();
            resultItemIndex = enumerator.getCurrentIndex();
            resultItem = enumerator.getCurrent();
        }
        return resultItemIndex === this.getIndex(item);
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return this._itemsFactoryResolver.bind(this, superFactory);
    }

    setExpandedItems(expandedKeys: CrudEntityKey[]): void {
        super.setExpandedItems(expandedKeys);
    }

    // endregion

    // region itemsFactoryResolver

    protected _itemsFactoryResolver(
        superFactory: ItemsFactory<T>,
        options?: ITreeItemOptions<S>
    ): ItemsFactory<T> {
        options.rowSeparatorSize = this._$rowSeparatorSize;
        return superFactory.call(this, options);
    }

    // endregion itemsFactoryResolver
}

Object.assign(TreeCollection.prototype, {
    '[Controls/tree:TreeCollection]': true,
    _moduleName: 'Controls/tree:TreeCollection',
    _itemModule: 'Controls/tree:TreeItem',
    _nodeFooterModule: 'Controls/tree:TreeNodeFooterItem',
    _nodeHeaderModule: 'Controls/tree:TreeNodeHeaderItem',
});
