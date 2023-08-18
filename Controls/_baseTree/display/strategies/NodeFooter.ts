/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import Tree from './../Tree';
import TreeItem from './../TreeItem';
import { Model } from 'Types/entity';
import ExtraNodeItem, {
    ISortOptions as IBaseSortOptions,
    IInsertExtraItemIndexParams,
    TExtraItemVisibilityCallback,
} from './ExtraNodeItem';

export interface ISortOptions extends IBaseSortOptions {
    hasNodeFooterViewConfig?: boolean;
}

export function shouldDisplayNodeFooterTemplate(
    item: TreeItem,
    hasNodeFooterViewConfig: boolean,
    extraItemVisibilityCallback: TExtraItemVisibilityCallback
): boolean {
    // если темплейт не задан, то мы точно его не будем отображать. А если есть данные еще,
    // то в первую очередь отображается кнопка Еще
    if (!hasNodeFooterViewConfig || item.hasMoreStorage('forward')) {
        return false;
    }

    // если колбэк не задан, то всегда отображаем темплейт
    return !extraItemVisibilityCallback || extraItemVisibilityCallback(item.getContents());
}

export default class NodeFooter<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends ExtraNodeItem {
    protected _getExtraItemContent(item: T): string {
        return 'node-footer-' + item.getContents().getKey();
    }

    protected _setExtraItem(item: T, extraItem: T): void {
        item.setNodeFooter(extraItem);
    }

    protected _shouldAddExtraItem(item: T, options: ISortOptions): boolean {
        return (
            item.hasMoreStorage('forward') ||
            shouldDisplayNodeFooterTemplate(
                item,
                options.hasNodeFooterViewConfig,
                options.extraItemVisibilityCallback
            )
        );
    }

    protected _getSortItemsOptions(): ISortOptions {
        return {
            ...super._getSortItemsOptions(),
            hasNodeFooterViewConfig: !!(this._options.display as Tree).getNodeFooterTemplate(),
        };
    }

    protected _insertExtraItemIndex(params: IInsertExtraItemIndexParams): void {
        const getItemsCount = (node) => {
            const oneOfParentsIsEqualNode = (item) => {
                if (!item || !item.getParent) {
                    return false;
                }

                if (item.getParent() === node) {
                    return true;
                } else {
                    return oneOfParentsIsEqualNode(item.getParent());
                }
            };

            let count = 0;
            items.forEach((item) => {
                // TODO: Убрать в константу или определить getLevel для группы дерева
                // https://online.sbis.ru/opendoc.html?guid=ca34d365-26db-453d-b05a-eb6c708c59ee
                if (
                    (item['[Controls/_display/GroupItem]'] ? 1 : item.getLevel()) >
                        node.getLevel() &&
                    oneOfParentsIsEqualNode(item)
                ) {
                    count++;
                }
            });
            return count;
        };

        const { extraItem, extraItems, itemsOrder, items } = params;
        const node = extraItem.getNode();
        const sourceNodeIndex = items.indexOf(node);
        const countExtraItems = extraItems.length;
        // По мере добавления дополнительных элементов, индекс изменяется
        const currentNodeIndex = itemsOrder.indexOf(sourceNodeIndex + countExtraItems);
        const extraItemIndex = extraItems.indexOf(extraItem);

        // TODO здесь нужно вызывать TreeItem::getChildren, но он вызывает все стратегии и происходит зацикливание
        const countChildren = getItemsCount(node);
        // вставляем индекс футера в конец узла
        itemsOrder.splice(currentNodeIndex + countChildren + 1, 0, extraItemIndex);
    }
}

Object.assign(NodeFooter.prototype, {
    '[Controls/_display/itemsStrategy/NodeFooter]': true,
    _moduleName: 'Controls/display:itemsStrategy.NodeFooter',
});
