import * as React from 'react';
import CollectionItem from './CollectionItem';

/**
 * Распорка для адаптивной плитки
 * @private
 */
export default class SpacerItem extends CollectionItem {
    readonly listElementName: string = 'controls-AdaptiveTileView__item_spacer';
    readonly Markable: boolean = false;
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;

    get key(): string {
        return this._instancePrefix + this.getInstanceId();
    }

    shouldDisplayAutoResizer(): boolean {
        return false;
    }

    getItemClasses(): string {
        return (
            ' controls-AdaptiveTileView__spacerItem ' +
            super.getItemClasses.apply(this, arguments)
        );
    }

    getItemStyles(): React.CSSProperties {
        return super.getItemStyles.apply(this, arguments);
    }
}

Object.assign(SpacerItem.prototype, {
    '[Controls/_adaptiveTile/SpacerItem]': true,
    _moduleName: 'Controls/adaptiveTile:SpacerItem',
    _instancePrefix: 'adaptiveTile-spacer-item-',
});
