/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import TileCollectionItem, { ITileCollectionItemOptions } from './TileCollectionItem';
import InvisibleItem from './mixins/InvisibleItem';
import { mixin } from 'Types/util';
import { ITileItemProps } from './mixins/TileItem';
export interface IInvisibleTileItemOptions extends ITileCollectionItemOptions {
    lastInvisibleItem: boolean;
}

/**
 * Невидимый элемент в плиточной коллекции
 * @private
 */
export default class InvisibleTileItem extends mixin<TileCollectionItem, InvisibleItem>(
    TileCollectionItem,
    InvisibleItem
) {
    readonly listElementName: string = 'controls-TileView__item_invisible';

    get Markable(): boolean {
        return false;
    }

    constructor(options: IInvisibleTileItemOptions) {
        super(options);
        InvisibleItem.initMixin(this);
    }

    // переопределяем key, т.к. по дефолту он берется из contents, но в пачке невидимых элементов одинаковый contents,
    // поэтому падает ошибка с дубликатами ключе в верстке
    get key(): string {
        return this.getInstanceId();
    }

    getItemClasses(): string {
        return this.getInvisibleClasses() + ' ' + super.getItemClasses.apply(this, arguments);
    }

    getItemStyles({
        itemType = 'default',
        width,
        staticHeight,
        imagePosition = 'top',
        imageViewMode = 'rectangle',
    }: ITileItemProps): React.CSSProperties {
        if (this.isLastInvisibleItem()) {
            return null;
        }
        return super.getItemStyles.apply(this, arguments);
    }
}

Object.assign(InvisibleTileItem.prototype, {
    '[Controls/_tile/InvisibleTileItem]': true,
    _moduleName: 'Controls/tile:InvisibleTileItem',
    _instancePrefix: 'invisible-tile-item-',
});
