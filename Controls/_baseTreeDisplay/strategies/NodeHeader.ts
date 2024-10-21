/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import ExtraNodeItem, { IInsertExtraItemIndexParams, ISortOptions } from './ExtraNodeItem';
import TreeItem from '../TreeItem';
import { Model } from 'Types/entity';

/**
 * Стратегия, позволяющая создавать заголовки узлов.
 * (Контент, отображаемый перед первой отрисованной дочерней записью узла).
 * @private
 */
export default class NodeHeader<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends ExtraNodeItem {
    /**
     * Возвращает содержимое-идентификатор подвала узла.
     */
    protected _getExtraItemContent(item: T): string {
        return 'node-header-' + item.getContents().getKey();
    }

    /**
     * Добавляет связь родительского узла с его заголовком.
     */
    protected _setExtraItem(item: T, extraItem: T): void {
        item.setNodeHeader(extraItem);
    }

    /**
     * Возвращает признак того, что необходимо создавать заголовок узла.
     */
    protected _shouldAddExtraItem(item: TreeItem<Model>, options: ISortOptions<S, T>): boolean {
        return item.hasMoreStorage('backward') || options.display.hasNodeHeaderConfig();
    }

    /**
     * Добавляет индекс заголовка узла в карту отсортированных записей стратегии.
     */
    protected _insertExtraItemIndex(params: IInsertExtraItemIndexParams): void {
        const { extraItem, extraItems, items, itemsOrder } = params;
        const node = extraItem.getNode();
        const sourceNodeIndex = items.indexOf(node);
        const extraItemIndex = extraItems.indexOf(extraItem);

        // Вставляем индекс хедера в начало узла. Учитываем индекс самого текущего элемента в массиве extra-элементов -
        // это позволяет учитывать количество вставленных extra-элементов перед текущим.
        itemsOrder.splice(sourceNodeIndex + extraItemIndex + 1, 0, extraItemIndex);
    }
}

Object.assign(NodeHeader.prototype, {
    '[Controls/_display/itemsStrategy/NodeHeader]': true,
    _moduleName: 'Controls/display:itemsStrategy.NodeHeader',
});
