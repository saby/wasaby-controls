/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { InvisibleItem } from 'Controls/tile';
import { mixin } from 'Types/util';
import TreeTileCollectionItem from './TreeTileCollectionItem';

/**
 * Невидимый элемент в иерархической плитке
 * @private
 */
export default class InvisibleTreeTileItem extends mixin<TreeTileCollectionItem, InvisibleItem>(
    TreeTileCollectionItem,
    InvisibleItem
) {
    readonly listElementName: string = 'controls-TileView__item_invisible';
    get Markable(): boolean {
        return false;
    }

    constructor(options: any) {
        super(options);
        InvisibleItem.initMixin(this, options);
    }

    // переопределяем key, т.к. по дефолту он берется из contents, но в пачке невидимых элементов одинаковый contents,
    // поэтому падает ошибка с дубликатами ключей в верстке
    get key(): string {
        return this.getInstanceId();
    }

    getItemClasses(): string {
        return this.getInvisibleClasses() + ' ' + super.getItemClasses.apply(this, arguments);
    }

    getItemStyles(): string {
        if (this.isLastInvisibleItem()) {
            return '';
        }
        return super.getItemStyles.apply(this, arguments);
    }
}

Object.assign(InvisibleTreeTileItem.prototype, {
    '[Controls/_treeTile/InvisibleTreeTileItem]': true,
    _moduleName: 'Controls/treeTile:InvisibleTreeTileItem',
    _instancePrefix: 'invisible-tree-tile-item-',
});
