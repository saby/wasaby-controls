/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
/**
 * Миксин, который содержит логику отображения невидимого элемента в коллекции плиток.
 * @private
 */
export default abstract class InvisibleItem {
    get Markable(): boolean {
        return false;
    }

    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;
    readonly ActivatableItem: boolean = false;

    protected _$lastInvisibleItem: boolean;

    static initMixin(instance) {
        instance.Fadable = false;
        instance.SelectableItem = false;
        instance.EnumerableItem = false;
        instance.EdgeRowSeparatorItem = false;
        instance.DraggableItem = false;
        instance.SupportItemActions = false;
        instance.DisplaySearchValue = false;
        instance.ActivatableItem = false;
    }

    /**
     * Возвращает классы стилей для невидимого элемента
     */
    getInvisibleClasses(): string {
        let classes =
            ' controls-ListView__itemV ' +
            'js-controls-List_invisible-for-VirtualScroll ' +
            'controls-TileView__item_invisible ';
        if (this.isLastInvisibleItem()) {
            classes += ' controls-TreeTileView__separator ';
        } else {
            classes += ' controls-TileView__item ws-flex-grow-1 ';
        }
        classes += this.getItemPaddingClasses();
        return classes;
    }

    /**
     * Возвращает признак, означающий что данный элемент является последним
     * элементом среди пачки подряд идущих невидимых элементов
     */
    isLastInvisibleItem(): boolean {
        return this._$lastInvisibleItem;
    }

    shouldDisplayAutoResizer(): boolean {
        return false;
    }

    abstract getItemPaddingClasses(): string;
}

Object.assign(InvisibleItem.prototype, {
    '[Controls/_tile/display/mixins/InvisibleItem]': true,
    _$lastInvisibleItem: false,
});
